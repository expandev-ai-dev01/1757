/**
 * @summary
 * Creates the stock movement tracking schema with all necessary tables,
 * constraints, and indexes for the StockBox inventory management system.
 *
 * @migration 001_create_stock_movement_schema
 * @version 1.0.0
 */

-- Create functional schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
  EXEC('CREATE SCHEMA [functional]');
END;
GO

/**
 * @table product Product master data
 * @multitenancy true
 * @softDelete true
 * @alias prd
 */
CREATE TABLE [functional].[product] (
  [idProduct] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [minimumQuantity] NUMERIC(15, 2) NOT NULL DEFAULT (0),
  [maximumQuantity] NUMERIC(15, 2) NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table stockMovement Stock movement transactions
 * @multitenancy true
 * @softDelete false
 * @alias stk
 */
CREATE TABLE [functional].[stockMovement] (
  [idStockMovement] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduct] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [movementType] VARCHAR(20) NOT NULL,
  [quantity] NUMERIC(15, 2) NOT NULL,
  [dateTime] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [reason] NVARCHAR(255) NULL,
  [referenceDocument] NVARCHAR(50) NULL,
  [batchNumber] NVARCHAR(30) NULL,
  [expirationDate] DATE NULL,
  [location] NVARCHAR(50) NULL,
  [unitCost] NUMERIC(18, 6) NULL
);
GO

/**
 * @primaryKey pkProduct
 * @keyType Object
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [pkProduct] PRIMARY KEY CLUSTERED ([idProduct]);
GO

/**
 * @primaryKey pkStockMovement
 * @keyType Object
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [pkStockMovement] PRIMARY KEY CLUSTERED ([idStockMovement]);
GO

/**
 * @foreignKey fkStockMovement_Product
 * @target functional.product
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [fkStockMovement_Product] FOREIGN KEY ([idProduct])
REFERENCES [functional].[product]([idProduct]);
GO

/**
 * @check chkStockMovement_MovementType
 * @enum {entrada} Stock entry
 * @enum {saida} Stock exit
 * @enum {ajuste} Stock adjustment
 * @enum {criacao} Product creation
 * @enum {exclusao} Product deletion
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [chkStockMovement_MovementType] CHECK ([movementType] IN ('entrada', 'saida', 'ajuste', 'criacao', 'exclusao'));
GO

/**
 * @index ixProduct_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account]
ON [functional].[product]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Name
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Name]
ON [functional].[product]([idAccount], [name])
INCLUDE ([description], [minimumQuantity], [maximumQuantity])
WHERE [deleted] = 0;
GO

/**
 * @index uqProduct_Account_Name
 * @type Unique
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqProduct_Account_Name]
ON [functional].[product]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixStockMovement_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account]
ON [functional].[stockMovement]([idAccount]);
GO

/**
 * @index ixStockMovement_Account_Product
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_Product]
ON [functional].[stockMovement]([idAccount], [idProduct])
INCLUDE ([movementType], [quantity], [dateTime]);
GO

/**
 * @index ixStockMovement_Account_DateTime
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_DateTime]
ON [functional].[stockMovement]([idAccount], [dateTime] DESC)
INCLUDE ([idProduct], [movementType], [quantity]);
GO

/**
 * @index ixStockMovement_Account_MovementType
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_MovementType]
ON [functional].[stockMovement]([idAccount], [movementType])
INCLUDE ([idProduct], [quantity], [dateTime]);
GO

/**
 * @index ixStockMovement_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_User]
ON [functional].[stockMovement]([idAccount], [idUser])
INCLUDE ([idProduct], [movementType], [quantity], [dateTime]);
GO

/**
 * @index ixStockMovement_Account_ReferenceDocument
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_ReferenceDocument]
ON [functional].[stockMovement]([idAccount], [referenceDocument])
WHERE [referenceDocument] IS NOT NULL;
GO