"use strict";

import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING, ASSERT_SWITCHDEFAULT } from "../../../../../model/utility/assert/assert";
import { mergeRectangles } from "./src/dplmovierectangle";
import { drawAllocable, drawLineHeader, getAllocableMinimalXSpacing, getAllocaleDimension } from "./src/dplmovierendererhelper";

const ALLOCABLE_BASE_LINE_INCREMENT = 10;

/*color*/
const ALLOCABLE_CELLHEADER_BACKGROUNDCOLOR = "#a7d1f5";
const ALLOCABLE_BACKGROUNDCOLOR = "#d0ebff";

/*tracked object properties */
const TRACKEDOBJECT_PROPERTY_STARTDATE = "StartDate";
const TRACKEDOBJECT_PROPERTY_ENDDATE = "EndDate";
const TRACKEDOBJECT_PROPERTY_IPDID = "InventoryProducerDetailId";
const TRACKEDOBJECT_PROPERTY_PRODUCTLOCATIONID = "ProductLocation";
const TRACKEDOBJECT_PROPERTY_QUANTITY = "Quantity";
const TRACKEDOBJECT_PROPERTY_RESERVEDQUANTITY = "ReservedQuantity";

/*bucket part enum*/
const BUCKETPART_START = "start";
const BUCKETPART_END = "end";

export class DPLMovieAllocableRenderer {
  /** class responsible for displaying the object that can be allocated.
   * @param canvasContext canvas on which to draw.
   * @param dplMovieProductLocationRenderer renderer of the productLocations
   * @param dplMovieBucketRenderer renderer of the Buckets
   * @param geometryConfig configuration of the geometry.
   * @param {String} objectClassId object class to display
   * @param {String} lineCellText text to display line header cell
   */
  constructor(canvasContext, dplMovieProductLocationRenderer, dplMovieBucketRenderer, geometryConfig, objectClassId, lineCellText) {
    ASSERT_EXIST(canvasContext);
    ASSERT_EXIST(dplMovieProductLocationRenderer);
    ASSERT_EXIST(dplMovieBucketRenderer);
    ASSERT_EXIST(geometryConfig);
    ASSERT_ISSTRING(objectClassId);
    ASSERT_ISSTRING(lineCellText);
    this._canvasContext = canvasContext;
    this._productLocationRenderer = dplMovieProductLocationRenderer;
    this._dplMovieBucketRenderer = dplMovieBucketRenderer;
    this._geometryConfig = geometryConfig;
    this._objectClassId = objectClassId;
    this._lineCellText = lineCellText;
    this._allocableRects = new Map();
  }

  /** render the allocable object of the given DPLMovieRuntime.
   *  @param {DPLMovieRuntime} dplMovieRuntime DPLMovie runtime.
   *  @param {DPLMovieTrackedObject} productLocationTrackedObject the product-location for which to rendering the allocables
   *  @param {DPLMovieRectangle} productLocationRectangle rectangle giving the position of the header of this Product-Location
   *  @returns {DPLMovieRectangle} extended rectangle of all drawn lines and allocables.
   */
  render(dplMovieRuntime, productLocationTrackedObject, productLocationRectangle) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);
    ASSERT_EXIST(productLocationTrackedObject);
    ASSERT_EXIST(productLocationRectangle);

    const minimalAllocableSpacing = getAllocableMinimalXSpacing(this._geometryConfig.zoomFactor);

    /*find in which buckets the allocables are*/
    /*----------------------------------------*/
    const bucketToAllocableMap = new Map();
    const allocableToBucketsMap = new Map();
    // it is import to sort the allocable base on their date such that the drawing is deterministic
    const allocableObjects = this._sortAllocableBaseOnDates(dplMovieRuntime.getTrackedObjects(this._objectClassId));
    for (const allocableObject of allocableObjects) {
      const allocableProductLocationId = this._getProductLocationId(allocableObject);
      if (allocableProductLocationId !== productLocationTrackedObject.Id) continue;
      const buckets_parts = this._getBuckets(allocableObject, dplMovieRuntime);
      allocableToBucketsMap.set(allocableObject, buckets_parts);
      for (const bucket_part of buckets_parts) {
        const key = this._makeBucketPartKey(bucket_part.bucket, bucket_part.part);
        if (!bucketToAllocableMap.has(key)) {
          bucketToAllocableMap.set(key, [allocableObject]);
          continue;
        }
        bucketToAllocableMap.get(key).push(allocableObject);
      }
    }

    /*draw the line header */
    /*---------------------*/
    //compute the largest number of allocable in one bucket part
    let maxNumberOfAllocableInBucketPart = 0;
    for (const [_, allocables] of bucketToAllocableMap) {
      maxNumberOfAllocableInBucketPart = Math.max(maxNumberOfAllocableInBucketPart, allocables.length);
    }
    // the heigh of the line depends on the maximum number of allocable in the buckets.
    const prdTotalRect = this._productLocationRenderer.getProductLocationCurrentTotalRectangle(productLocationTrackedObject.Id);
    const lineYStart = prdTotalRect.Y + prdTotalRect.Heigth + ALLOCABLE_BASE_LINE_INCREMENT * this._geometryConfig.zoomFactor;
    const lineRect = drawLineHeader(
      this._canvasContext,
      this._lineCellText,
      ALLOCABLE_CELLHEADER_BACKGROUNDCOLOR,
      productLocationRectangle.X,
      lineYStart,
      this._geometryConfig.zoomFactor,
      maxNumberOfAllocableInBucketPart
    );
    let totalRect = lineRect;

    /*draw the allocables */
    /*--------------------*/
    const bucketPartPosition = new Set(); /*holds the bucket-part-position's where we already drawn an allocable in a bucket-part.*/
    for (const [allocable, buckets_parts] of allocableToBucketsMap) {
      /*find the start and end of the X position.*/
      let allocableXstart = null; /*hold the start of the x coordinates */
      let allocableXend = null; /*hold the end of the x coordinates */
      for (const { bucket, part } of buckets_parts) {
        const bucketRect = this._dplMovieBucketRenderer.getProductLocationBucketPosition(productLocationTrackedObject.Id, bucket.Id);
        ASSERT_EXIST(bucketRect);
        let newXstart = 0;
        let newXend = 0;
        switch (part) {
          case BUCKETPART_START:
            {
              const middleBucketX = bucketRect.X + bucketRect.Width / 2;
              newXstart = bucketRect.X;
              newXend = middleBucketX - minimalAllocableSpacing / 2;
            }
            break;
          case BUCKETPART_END:
            {
              const middleBucketX = bucketRect.X + bucketRect.Width / 2;
              newXstart = middleBucketX + minimalAllocableSpacing / 2;
              newXend = bucketRect.X + bucketRect.Width;
            }
            break;
          default:
            ASSERT_SWITCHDEFAULT(part);
        }
        newXstart = Math.floor(newXstart);
        newXend = Math.floor(newXend);
        allocableXstart = allocableXstart !== null ? Math.min(allocableXstart, newXstart) : newXstart;
        allocableXend = allocableXend !== null ? Math.max(allocableXend, newXend) : newXend;
      }
      ASSERT(allocableXstart !== null, `for a '${this._objectClassId}' with id '${allocable.Id}', we did not find any start x position`);
      ASSERT(allocableXend !== null, `for a '${this._objectClassId}' with id '${allocable.Id}', we did not find any end x position`);

      /*find the start of the y position */
      /* The logic here loops over a possible position (integer representing a y positionning).
           if the possible position is not already taken by all bucket-part's (x positionning),
           we use this position (= fill foundPosition).
        */
      let foundPosition = null;
      let tentativePosition = 0;
      while (foundPosition == null) {
        // check if all bucket-part are free for this position
        let isTentativePositionFree = true;
        for (const { bucket, part } of buckets_parts) {
          const key = this._makeBucketPartPositionKey(bucket, part, tentativePosition);
          if (bucketPartPosition.has(key)) {
            isTentativePositionFree = false;
            break;
          }
        }
        // stop if the position is free; continue otherwise with the next position
        if (isTentativePositionFree) foundPosition = tentativePosition;
        else tentativePosition++;
      }
      ASSERT(foundPosition !== null, `for a '${this._objectClassId}' with id '${allocable.Id}', we did not find any y position`);
      const allocableY = lineRect.Y + foundPosition * (minimalAllocableSpacing + getAllocaleDimension(this._geometryConfig.zoomFactor));

      const allocableRect = drawAllocable(
        this._canvasContext,
        String(this._getQuantity(allocable)),
        ALLOCABLE_BACKGROUNDCOLOR,
        allocableXstart,
        allocableXend,
        allocableY,
        this._geometryConfig.zoomFactor
      );
      this._allocableRects.set(allocable.Id, allocableRect);
      totalRect = mergeRectangles(totalRect, allocableRect);

      // remember that this allocable occupies these bucket-part-position's.
      for (const { bucket, part } of buckets_parts) {
        const key = this._makeBucketPartPositionKey(bucket, part, foundPosition);
        ASSERT(
          !bucketPartPosition.has(key),
          `the bucket-part-position '${key}' has been taken by a '${this._objectClassId}' with id '${allocable.Id}', but it was already taken`
        );
        bucketPartPosition.add(key);
      }
    }
    return totalRect;
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    this._allocableRects = new Map();
  }

  /** return the rectangle drawn for an allocable.
   * @param {String} allocableId allocable id
   * @returns {DPLMovieRectangle} a rectangle
   */
  getAllocablePosition(allocableId) {
    ASSERT(this._allocableRects.has(allocableId), `the allocable with type '${this._objectClassId}' and Id '${allocableId}' was not drawn.`);
    return this._allocableRects.get(allocableId);
  }

  /** returns the object class id of the allocable that this renderer is making.
   */
  getAllocableObjectClassId() {
    return this._objectClassId;
  }

  // -------
  // PRIVATE
  // -------

  /** make a key for the map indexing on bucket-part.
   * @param {DPLMovieTrackedObject} bucket
   * @param {String} part start/end
   * @returns key
   */
  _makeBucketPartKey(bucket, part) {
    return `${bucket.Id}-${part}`;
  }

  /** make a key for the map indexing on bucket-part-position.
   * @param {DPLMovieTrackedObject} bucket
   * @param {String} part start/end, which is the column in the bucket
   * @param {Integer} position row in the bucket
   * @returns key
   */
  _makeBucketPartPositionKey(bucket, part, position) {
    return `${bucket.Id}-${part}-${position}`;
  }

  /** return the Bucket tracked object which overlap with this allocable object
   * @param {DPLMovieTrackedObject} allocable allocable object
   * @param {DPLMovieRuntime} dplMovieRuntime DPLMovie runtime.
   * @returns {DPLMovieTrackedObject} buckets overlapping with the allocable
   * @return {Array<pair<Bucket,Part>>} an array of object containing the bucket and the part (start/end)
   */
  _getBuckets(allocable, dplMovieRuntime) {
    // find first the start date and end date of the allocable.
    const [startDate, endDate] = this._getPeriod(allocable);

    // find the buckets
    const buckets = [];
    for (const bucket of dplMovieRuntime.getTrackedObjects("Bucket")) {
      if (bucket.StartDate > startDate && bucket.EndDate < endDate) {
        buckets.push({ bucket: bucket, part: BUCKETPART_START }, { bucket: bucket, part: BUCKETPART_END });
        continue;
      }

      const bucketMiddleDate = new Date(bucket.StartDate.getTime() + (bucket.EndDate - bucket.StartDate) / 2);
      const overlapOrContainedInStart = this._overlapsOrContains(bucket.StartDate, bucketMiddleDate, startDate, endDate);
      const overlapOrContainedInEnd = this._overlapsOrContains(bucketMiddleDate, bucket.EndDate, startDate, endDate);
      if (overlapOrContainedInStart && overlapOrContainedInEnd) {
        buckets.push({ bucket: bucket, part: BUCKETPART_START }, { bucket: bucket, part: BUCKETPART_END });
        continue;
      }
      if (overlapOrContainedInStart) {
        buckets.push({ bucket: bucket, part: BUCKETPART_START });
        continue;
      }
      if (overlapOrContainedInEnd) {
        buckets.push({ bucket: bucket, part: BUCKETPART_END });
        continue;
      }
    }
    return buckets;
  }

  /** return the start date and end date of an allocable
   * @param {DPLMovieTrackedObject} allocable allocable object
   * @returns {Array<Date>} start date and end date.
   */
  _getPeriod(allocable) {
    let startDate = null;
    if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_STARTDATE)) startDate = allocable.StartDate;
    else if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_IPDID)) startDate = allocable.InventoryProducerDetailId.StartDate;
    ASSERT(
      startDate !== null && startDate !== undefined,
      `There is no way we can get a StartDate from the allocable tracked object '${this._objectClassId}' with Id '${allocable.Id}'`
    );
    let endDate = null;
    if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_ENDDATE)) endDate = allocable.EndDate;
    else if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_IPDID)) endDate = allocable.InventoryProducerDetailId.EndDate;
    ASSERT(
      endDate !== null && endDate !== undefined,
      `There is no way we can get an EndDate from the allocable tracked object '${this._objectClassId}' with Id '${allocable.Id}'`
    );
    return [startDate, endDate];
  }

  /**
   * @param {Date} firstPeriodStarDate first period start date
   * @param {Date} firstPeriodEndDate first period end date
   * @param {Date} secondPeriodStarDate second period start date
   * @param {Date} secondPeriodEndDate second period end date
   * @returns true if the first period overlarps or contains the second.
   */
  _overlapsOrContains(firstPeriodStarDate, firstPeriodEndDate, secondPeriodStarDate, secondPeriodEndDate) {
    return (
      (firstPeriodStarDate <= secondPeriodStarDate && firstPeriodEndDate > secondPeriodStarDate) ||
      (firstPeriodStarDate < secondPeriodEndDate && firstPeriodEndDate > secondPeriodEndDate)
    );
  }

  /** return the product-location id of this allocable.
   * @param {DPLMovieTrackedObject} allocableObject
   */
  _getProductLocationId(allocable) {
    let productLocationId = null;
    if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_PRODUCTLOCATIONID)) productLocationId = allocable.ProductLocation.Id;
    else if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_IPDID)) productLocationId = allocable.InventoryProducerDetailId.ProductLocation.Id;
    ASSERT(
      productLocationId !== null && productLocationId !== undefined,
      `There is no way we can get a ProductLocationId from the allocable tracked object '${this._objectClassId}' with Id '${allocable.Id}'`
    );
    return productLocationId;
  }

  /**
   * @param {DPLMovieTrackedObject} allocable
   * @returns the quantity of this allocable.
   */
  _getQuantity(allocable) {
    let quantity = null;
    if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_QUANTITY)) quantity = allocable.Quantity;
    else if (allocable.hasOwnProperty(TRACKEDOBJECT_PROPERTY_RESERVEDQUANTITY)) quantity = allocable.ReservedQuantity;
    ASSERT(
      quantity !== null && quantity !== undefined,
      `There is no way we can get a quantity from the allocable tracked object '${this._objectClassId}' with Id '${allocable.Id}'`
    );
    return quantity;
  }

  /** return a sorted version of the given array.
   *  The allocables are first sorted on their start-date (chronologically) and then on their end date (anti-chronologically).
   * @param {Array<DPLMovieTrackedObject>} allocableObject
   * @returns sorted array of allocable.
   */
  _sortAllocableBaseOnDates(allocables) {
    const self = this;
    return allocables.sort(function (allocable1, allocable2) {
      const [startDate1, endDate1] = self._getPeriod(allocable1);
      const [startDate2, endDate2] = self._getPeriod(allocable2);
      if (startDate1 !== startDate2) return startDate1 - startDate2;
      return endDate2 - endDate1;
    });
  }
}
