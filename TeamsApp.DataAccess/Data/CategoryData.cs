using Microsoft.ApplicationInsights;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamsApp.Common.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.DataAccess.Data
{
    public class CategoryData : ICategoryData
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        public CategoryData(
            ILogger<CategoryData> logger
            ,TelemetryClient telemetryClient

            ,IConfiguration config
            , ISQLDataAccess db)
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
        }

        #region INSERT CATEGORY
        /// <summary>
        /// InsertCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns >ReturnMessageModel</returns>
        public async Task<ReturnMessageModel> InsertCategory(CategoryModel categoryModel)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Category_Insert",
                new
                {
                    categoryModel.CategoryName
                    ,
                    categoryModel.CategoryDescription
                    ,
                    categoryModel.CreatedBy
                    ,
                    categoryModel.CreatedByEmail
                    ,
                    categoryModel.CreatedByADID
                });
                return results.FirstOrDefault();
            }
            catch(Exception ex)
            {
                this._logger.LogError(ex, $"InsertCategory() execution failed in CategoryData.cs");
                throw ex;
            }
        }
        #endregion

        #region UPDATE CATEGORY
        /// <summary>
        /// UpdateCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>ReturnMessageModel</returns>
        public async Task<ReturnMessageModel> UpdateCategory(CategoryModel categoryModel)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Category_Update",
                new
                {
                    categoryModel.CategoryId
                    ,
                    categoryModel.CategoryName
                    ,
                    categoryModel.CategoryDescription
                    ,
                    categoryModel.IsActive
                    ,
                    categoryModel.UpdatedBy
                    ,
                    categoryModel.UpdatedByEmail
                    ,
                    categoryModel.UpdatedByADID
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"UpdateCategory() execution failed in CategoryData.cs");
                throw ex;
            }
        }
        #endregion

        #region TOGGLE ISACTIVE CATEGORY
        /// <summary>
        /// ToggleIsActiveCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>ReturnMessageModel</returns>
        public async Task<ReturnMessageModel> ToggleIsActiveCategory(CategoryModel categoryModel)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Category_ToggleIsActive",
                new
                {
                    categoryModel.CategoryId
                    ,
                    categoryModel.IsActive
                    ,
                    categoryModel.UpdatedBy
                    ,
                    categoryModel.UpdatedByEmail
                    ,
                    categoryModel.UpdatedByADID
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"ToggleIsActiveCategory() execution failed in CategoryData.cs");
                throw ex;
            }
        }
        #endregion

        #region GETALL CATEGORY
        /// <summary>
        /// GetAllCategory
        /// </summary>
        /// <returns>IEnumerable<CategoryModel></returns>
        public async Task<IEnumerable<CategoryModel>> GetAllCategory(CategoryModel categoryModel)
        {
            try
            {
                var results = await _db.LoadData<CategoryModel, dynamic>("dbo.usp_Category_GetAll", 
                new 
                {
                    categoryModel.CategoryName
                    ,categoryModel.CreatedBy
                    ,categoryModel.UpdatedBy
                    ,categoryModel.CreatedByEmail
                    ,categoryModel.UpdatedByEmail
                });

                return results;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"GetAllCategory() execution failed in CategoryData.cs");
                throw ex;
            }
        }
        #endregion

        #region GETBYID CATEGORY
        /// <summary>
        /// GetCategoryById
        /// </summary>
        /// <returns>CategoryModel</returns>
        public async Task<CategoryModel> GetCategoryById(CategoryModel categoryModel)
        {
            try
            {
                var results = await _db.LoadData<CategoryModel, dynamic>("dbo.usp_Category_GetById",
                new
                {
                    categoryModel.CategoryId
                });

                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"GetCategoryById() execution failed in CategoryData.cs");
                throw ex;
            }
        }
        #endregion
    }
}
