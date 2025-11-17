/**
 * @summary
 * Creates stored procedures for stock movement operations including
 * create, list, get, and current stock calculation.
 *
 * @migration 002_create_stock_movement_procedures
 * @version 1.0.0
 */

/**
 * @summary
 * Creates a new stock movement record with validation of business rules
 * and automatic timestamp generation.
 *
 * @procedure spStockMovementCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/stock-movement
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier performing the movement
 *
 * @param {INT} idProduct
 *   - Required: Yes
 *   - Description: Product identifier
 *
 * @param {VARCHAR(20)} movementType
 *   - Required: Yes
 *   - Description: Type of movement (entrada, saida, ajuste, criacao, exclusao)
 *
 * @param {NUMERIC(15,2)} quantity
 *   - Required: Yes
 *   - Description: Quantity being moved
 *
 * @param {NVARCHAR(255)} reason
 *   - Required: No
 *   - Description: Reason for the movement
 *
 * @param {NVARCHAR(50)} referenceDocument
 *   - Required: No
 *   - Description: Reference document number
 *
 * @param {NVARCHAR(30)} batchNumber
 *   - Required: No
 *   - Description: Batch number
 *
 * @param {DATE} expirationDate
 *   - Required: No
 *   - Description: Expiration date
 *
 * @param {NVARCHAR(50)} location
 *   - Required: No
 *   - Description: Storage location
 *
 * @param {NUMERIC(18,6)} unitCost
 *   - Required: No
 *   - Description: Unit cost
 *
 * @returns {INT} idStockMovement - Created movement identifier
 *
 * @testScenarios
 * - Valid creation with all parameters
 * - Security validation failure scenarios
 * - Business rule validation scenarios
 * - Error handling and transaction rollback
 * - Edge cases and boundary conditions
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idProduct INTEGER,
  @movementType VARCHAR(20),
  @quantity NUMERIC(15, 2),
  @reason NVARCHAR(255) = NULL,
  @referenceDocument NVARCHAR(50) = NULL,
  @batchNumber NVARCHAR(30) = NULL,
  @expirationDate DATE = NULL,
  @location NVARCHAR(50) = NULL,
  @unitCost NUMERIC(18, 6) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    /**
     * @validation Product existence validation
     * @throw {productDoesntExist}
     */
    IF NOT EXISTS (
      SELECT *
      FROM [functional].[product] prd
      WHERE prd.[idProduct] = @idProduct
        AND prd.[idAccount] = @idAccount
        AND prd.[deleted] = 0
    )
    BEGIN
      ;THROW 51000, 'productDoesntExist', 1;
    END;

    /**
     * @validation Movement type validation
     * @throw {invalidMovementType}
     */
    IF @movementType NOT IN ('entrada', 'saida', 'ajuste', 'criacao', 'exclusao')
    BEGIN
      ;THROW 51000, 'invalidMovementType', 1;
    END;

    /**
     * @validation Quantity validation for entrada and criacao
     * @throw {quantityMustBePositive}
     */
    IF (@movementType IN ('entrada', 'criacao')) AND (@quantity <= 0)
    BEGIN
      ;THROW 51000, 'quantityMustBePositive', 1;
    END;

    /**
     * @validation Quantity validation for saida
     * @throw {quantityMustBeNegative}
     */
    IF (@movementType = 'saida') AND (@quantity >= 0)
    BEGIN
      ;THROW 51000, 'quantityMustBeNegative', 1;
    END;

    /**
     * @validation Quantity validation for exclusao
     * @throw {quantityMustBeZeroForDeletion}
     */
    IF (@movementType = 'exclusao') AND (@quantity <> 0)
    BEGIN
      ;THROW 51000, 'quantityMustBeZeroForDeletion', 1;
    END;

    /**
     * @validation Reason required for ajuste and exclusao
     * @throw {reasonRequired}
     */
    IF (@movementType IN ('ajuste', 'exclusao')) AND (@reason IS NULL OR @reason = '')
    BEGIN
      ;THROW 51000, 'reasonRequired', 1;
    END;

    /**
     * @validation Expiration date must be future date
     * @throw {expirationDateMustBeFuture}
     */
    IF (@expirationDate IS NOT NULL) AND (@expirationDate <= CAST(GETUTCDATE() AS DATE))
    BEGIN
      ;THROW 51000, 'expirationDateMustBeFuture', 1;
    END;

    /**
     * @validation Unit cost must be positive
     * @throw {unitCostMustBePositive}
     */
    IF (@unitCost IS NOT NULL) AND (@unitCost <= 0)
    BEGIN
      ;THROW 51000, 'unitCostMustBePositive', 1;
    END;

    /**
     * @validation Sufficient stock for saida
     * @throw {insufficientStock}
     */
    IF (@movementType = 'saida')
    BEGIN
      DECLARE @currentStock NUMERIC(15, 2);

      SELECT @currentStock = ISNULL(SUM(stk.[quantity]), 0)
      FROM [functional].[stockMovement] stk
      WHERE stk.[idAccount] = @idAccount
        AND stk.[idProduct] = @idProduct;

      IF (@currentStock + @quantity < 0)
      BEGIN
        ;THROW 51000, 'insufficientStock', 1;
      END;
    END;

    /**
     * @rule {db-transaction-control-pattern} Transaction for data integrity
     */
    BEGIN TRAN;

      INSERT INTO [functional].[stockMovement] (
        [idAccount],
        [idProduct],
        [idUser],
        [movementType],
        [quantity],
        [dateTime],
        [reason],
        [referenceDocument],
        [batchNumber],
        [expirationDate],
        [location],
        [unitCost]
      )
      VALUES (
        @idAccount,
        @idProduct,
        @idUser,
        @movementType,
        @quantity,
        GETUTCDATE(),
        @reason,
        @referenceDocument,
        @batchNumber,
        @expirationDate,
        @location,
        @unitCost
      );

      /**
       * @output {CreatedMovement, 1, 1}
       * @column {INT} idStockMovement - Created movement identifier
       */
      SELECT SCOPE_IDENTITY() AS [idStockMovement];

    COMMIT TRAN;

  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRAN;

    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Lists stock movements with filtering and pagination support.
 *
 * @procedure spStockMovementList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/stock-movement
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idProduct
 *   - Required: No
 *   - Description: Filter by product
 *
 * @param {VARCHAR(20)} movementType
 *   - Required: No
 *   - Description: Filter by movement type
 *
 * @param {DATE} startDate
 *   - Required: No
 *   - Description: Filter by start date
 *
 * @param {DATE} endDate
 *   - Required: No
 *   - Description: Filter by end date
 *
 * @param {INT} idUser
 *   - Required: No
 *   - Description: Filter by user
 *
 * @param {NVARCHAR(50)} referenceDocument
 *   - Required: No
 *   - Description: Filter by reference document
 *
 * @param {VARCHAR(20)} orderBy
 *   - Required: No
 *   - Description: Sort order (date_asc, date_desc, product_asc, product_desc)
 *
 * @param {INT} page
 *   - Required: No
 *   - Description: Page number (default: 1)
 *
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Items per page (default: 20, max: 100)
 *
 * @returns Multiple result sets with movement data and pagination info
 *
 * @testScenarios
 * - List all movements without filters
 * - Filter by product
 * - Filter by date range
 * - Filter by movement type
 * - Pagination scenarios
 * - Sort order validation
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementList]
  @idAccount INTEGER,
  @idProduct INTEGER = NULL,
  @movementType VARCHAR(20) = NULL,
  @startDate DATE = NULL,
  @endDate DATE = NULL,
  @idUser INTEGER = NULL,
  @referenceDocument NVARCHAR(50) = NULL,
  @orderBy VARCHAR(20) = 'date_desc',
  @page INTEGER = 1,
  @pageSize INTEGER = 20
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Page number must be positive
   * @throw {invalidPageNumber}
   */
  IF (@page < 1)
  BEGIN
    ;THROW 51000, 'invalidPageNumber', 1;
  END;

  /**
   * @validation Page size must be between 1 and 100
   * @throw {invalidPageSize}
   */
  IF (@pageSize < 1 OR @pageSize > 100)
  BEGIN
    ;THROW 51000, 'invalidPageSize', 1;
  END;

  /**
   * @validation End date must be greater than or equal to start date
   * @throw {invalidDateRange}
   */
  IF (@startDate IS NOT NULL AND @endDate IS NOT NULL AND @endDate < @startDate)
  BEGIN
    ;THROW 51000, 'invalidDateRange', 1;
  END;

  /**
   * @validation Order by must be valid
   * @throw {invalidOrderBy}
   */
  IF @orderBy NOT IN ('date_asc', 'date_desc', 'product_asc', 'product_desc')
  BEGIN
    ;THROW 51000, 'invalidOrderBy', 1;
  END;

  DECLARE @offset INTEGER = (@page - 1) * @pageSize;

  /**
   * @output {MovementList, n, n}
   * @column {INT} idStockMovement - Movement identifier
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR(100)} productName - Product name
   * @column {VARCHAR(20)} movementType - Movement type
   * @column {NUMERIC(15,2)} quantity - Quantity moved
   * @column {DATETIME2} dateTime - Movement date and time
   * @column {INT} idUser - User identifier
   * @column {NVARCHAR(255)} reason - Movement reason
   * @column {NVARCHAR(50)} referenceDocument - Reference document
   * @column {NVARCHAR(30)} batchNumber - Batch number
   * @column {DATE} expirationDate - Expiration date
   * @column {NVARCHAR(50)} location - Storage location
   * @column {NUMERIC(18,6)} unitCost - Unit cost
   * @column {NUMERIC(15,2)} runningBalance - Running stock balance
   */
  SELECT
    stk.[idStockMovement],
    stk.[idProduct],
    prd.[name] AS [productName],
    stk.[movementType],
    stk.[quantity],
    stk.[dateTime],
    stk.[idUser],
    stk.[reason],
    stk.[referenceDocument],
    stk.[batchNumber],
    stk.[expirationDate],
    stk.[location],
    stk.[unitCost],
    SUM(stk2.[quantity]) AS [runningBalance]
  FROM [functional].[stockMovement] stk
    JOIN [functional].[product] prd ON (prd.[idAccount] = stk.[idAccount] AND prd.[idProduct] = stk.[idProduct])
    JOIN [functional].[stockMovement] stk2 ON (stk2.[idAccount] = stk.[idAccount] AND stk2.[idProduct] = stk.[idProduct] AND stk2.[idStockMovement] <= stk.[idStockMovement])
  WHERE stk.[idAccount] = @idAccount
    AND (@idProduct IS NULL OR stk.[idProduct] = @idProduct)
    AND (@movementType IS NULL OR stk.[movementType] = @movementType)
    AND (@startDate IS NULL OR CAST(stk.[dateTime] AS DATE) >= @startDate)
    AND (@endDate IS NULL OR CAST(stk.[dateTime] AS DATE) <= @endDate)
    AND (@idUser IS NULL OR stk.[idUser] = @idUser)
    AND (@referenceDocument IS NULL OR stk.[referenceDocument] = @referenceDocument)
  GROUP BY
    stk.[idStockMovement],
    stk.[idProduct],
    prd.[name],
    stk.[movementType],
    stk.[quantity],
    stk.[dateTime],
    stk.[idUser],
    stk.[reason],
    stk.[referenceDocument],
    stk.[batchNumber],
    stk.[expirationDate],
    stk.[location],
    stk.[unitCost]
  ORDER BY
    CASE WHEN @orderBy = 'date_desc' THEN stk.[dateTime] END DESC,
    CASE WHEN @orderBy = 'date_asc' THEN stk.[dateTime] END ASC,
    CASE WHEN @orderBy = 'product_desc' THEN prd.[name] END DESC,
    CASE WHEN @orderBy = 'product_asc' THEN prd.[name] END ASC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;

  /**
   * @output {PaginationInfo, 1, 1}
   * @column {INT} totalRecords - Total number of records
   * @column {INT} totalPages - Total number of pages
   * @column {INT} currentPage - Current page number
   * @column {INT} pageSize - Items per page
   */
  SELECT
    COUNT(*) AS [totalRecords],
    CEILING(CAST(COUNT(*) AS FLOAT) / @pageSize) AS [totalPages],
    @page AS [currentPage],
    @pageSize AS [pageSize]
  FROM [functional].[stockMovement] stk
  WHERE stk.[idAccount] = @idAccount
    AND (@idProduct IS NULL OR stk.[idProduct] = @idProduct)
    AND (@movementType IS NULL OR stk.[movementType] = @movementType)
    AND (@startDate IS NULL OR CAST(stk.[dateTime] AS DATE) >= @startDate)
    AND (@endDate IS NULL OR CAST(stk.[dateTime] AS DATE) <= @endDate)
    AND (@idUser IS NULL OR stk.[idUser] = @idUser)
    AND (@referenceDocument IS NULL OR stk.[referenceDocument] = @referenceDocument);
END;
GO

/**
 * @summary
 * Gets a specific stock movement by ID.
 *
 * @procedure spStockMovementGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/stock-movement/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idStockMovement
 *   - Required: Yes
 *   - Description: Movement identifier
 *
 * @returns Movement details with product information
 *
 * @testScenarios
 * - Get existing movement
 * - Get non-existent movement
 * - Security validation
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementGet]
  @idAccount INTEGER,
  @idStockMovement INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Movement existence validation
   * @throw {movementDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[stockMovement] stk
    WHERE stk.[idStockMovement] = @idStockMovement
      AND stk.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'movementDoesntExist', 1;
  END;

  /**
   * @output {MovementDetail, 1, n}
   * @column {INT} idStockMovement - Movement identifier
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR(100)} productName - Product name
   * @column {VARCHAR(20)} movementType - Movement type
   * @column {NUMERIC(15,2)} quantity - Quantity moved
   * @column {DATETIME2} dateTime - Movement date and time
   * @column {INT} idUser - User identifier
   * @column {NVARCHAR(255)} reason - Movement reason
   * @column {NVARCHAR(50)} referenceDocument - Reference document
   * @column {NVARCHAR(30)} batchNumber - Batch number
   * @column {DATE} expirationDate - Expiration date
   * @column {NVARCHAR(50)} location - Storage location
   * @column {NUMERIC(18,6)} unitCost - Unit cost
   */
  SELECT
    stk.[idStockMovement],
    stk.[idProduct],
    prd.[name] AS [productName],
    stk.[movementType],
    stk.[quantity],
    stk.[dateTime],
    stk.[idUser],
    stk.[reason],
    stk.[referenceDocument],
    stk.[batchNumber],
    stk.[expirationDate],
    stk.[location],
    stk.[unitCost]
  FROM [functional].[stockMovement] stk
    JOIN [functional].[product] prd ON (prd.[idAccount] = stk.[idAccount] AND prd.[idProduct] = stk.[idProduct])
  WHERE stk.[idStockMovement] = @idStockMovement
    AND stk.[idAccount] = @idAccount;
END;
GO

/**
 * @summary
 * Calculates current stock levels for all products or a specific product.
 *
 * @procedure spStockCurrentGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/stock-current
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idProduct
 *   - Required: No
 *   - Description: Filter by specific product
 *
 * @returns Current stock levels with status indicators
 *
 * @testScenarios
 * - Get all product stock levels
 * - Get specific product stock level
 * - Stock status calculation
 */
CREATE OR ALTER PROCEDURE [functional].[spStockCurrentGet]
  @idAccount INTEGER,
  @idProduct INTEGER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @output {CurrentStock, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR(100)} productName - Product name
   * @column {NUMERIC(15,2)} currentQuantity - Current stock quantity
   * @column {NUMERIC(15,2)} minimumQuantity - Minimum stock level
   * @column {NUMERIC(15,2)} maximumQuantity - Maximum stock level
   * @column {VARCHAR(20)} stockStatus - Stock status (normal, baixo, critico, excesso)
   * @column {DATETIME2} lastMovementDate - Last movement date
   */
  SELECT
    prd.[idProduct],
    prd.[name] AS [productName],
    ISNULL(SUM(stk.[quantity]), 0) AS [currentQuantity],
    prd.[minimumQuantity],
    prd.[maximumQuantity],
    CASE
      WHEN ISNULL(SUM(stk.[quantity]), 0) = 0 THEN 'critico'
      WHEN ISNULL(SUM(stk.[quantity]), 0) < (prd.[minimumQuantity] * 0.5) THEN 'critico'
      WHEN ISNULL(SUM(stk.[quantity]), 0) < prd.[minimumQuantity] THEN 'baixo'
      WHEN ISNULL(SUM(stk.[quantity]), 0) > prd.[maximumQuantity] THEN 'excesso'
      ELSE 'normal'
    END AS [stockStatus],
    MAX(stk.[dateTime]) AS [lastMovementDate]
  FROM [functional].[product] prd
    LEFT JOIN [functional].[stockMovement] stk ON (stk.[idAccount] = prd.[idAccount] AND stk.[idProduct] = prd.[idProduct])
  WHERE prd.[idAccount] = @idAccount
    AND prd.[deleted] = 0
    AND (@idProduct IS NULL OR prd.[idProduct] = @idProduct)
  GROUP BY
    prd.[idProduct],
    prd.[name],
    prd.[minimumQuantity],
    prd.[maximumQuantity]
  ORDER BY
    prd.[name];
END;
GO