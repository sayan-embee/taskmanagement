using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using TeamsApp.Bot.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.Data;

namespace TeamsApp.Bot.Controllers.APIController
{
    [Route("api/v1.0/category")]
    [ApiController]
    //[Authorize]
    public class MasterCategoryController : BaseController
    {
        private readonly ILogger _logger;
        private readonly TelemetryClient _telemetryClient;

        private readonly ICategoryData _categoryData;

        public MasterCategoryController(
            ILogger<MasterCategoryController> logger
            ,TelemetryClient telemetryClient
            ,ICategoryData categoryData
            )
            : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient;
            this._categoryData = categoryData;
        }

        #region CREATE CATEGORY

        [HttpPost]
        [Route("createCategory")]
        public async Task<IActionResult> CreateCategory(CategoryModel categoryModel)
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                //if (categoryModel == null || categoryModel.CategoryName == null || categoryModel.CategoryName == "") return this.NotFound(); // 404

                if (categoryModel != null &&
                    categoryModel.CategoryName != null && categoryModel.CategoryName != "")
                {
                    categoryModel.CategoryName = categoryModel.CategoryName.ToUpper();
                    var response = await this._categoryData.InsertCategory(categoryModel);

                    sw.Stop();
                    TimeSpan ts = sw.Elapsed;

                    this.RecordEvent("CreateCategory() - Succeeded to create category.", RequestType.Succeeded);
                    this._logger.LogInformation("CreateCategory() executed successfully in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10));

                    if (response == null) return this.NotFound(); // 404

                    response.ExecutionTime = "CreateCategory() executed successfully in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10);

                    return this.Ok(response);
                }
                else
                {
                    return this.NotFound(); //404
                }
            }
            catch(Exception ex)
            {
                this.RecordEvent("CreateCategory() - Failed to create category.", RequestType.Failed);
                this._logger.LogError(ex, $"CreateCategory() execution failed for the following details - {JsonConvert.SerializeObject(categoryModel, Formatting.Indented)}");
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #region UPDATE CATEGORY

        [HttpPost]
        [Route("updateCategory")]
        public async Task<IActionResult> UpdateCategory(CategoryModel categoryModel)
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                if(categoryModel != null &&
                    categoryModel.CategoryId != 0 &&
                    categoryModel.CategoryName != null && categoryModel.CategoryName != "")
                {
                    categoryModel.CategoryName = categoryModel.CategoryName.ToUpper();
                    var response = await this._categoryData.UpdateCategory(categoryModel);

                    sw.Stop();
                    TimeSpan ts = sw.Elapsed;

                    this.RecordEvent("UpdateCategory() - Succeeded to update category.", RequestType.Succeeded);
                    this._logger.LogInformation($"UpdateCategory() executed successfully for category id - {categoryModel.CategoryId} in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10));

                    if (response == null) return this.NotFound(); // 404

                    response.ExecutionTime = $"UpdateCategory() executed successfully for category id - {categoryModel.CategoryId} in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10);

                    return this.Ok(response);
                }
                else
                {
                    return this.NotFound(); // 404
                }                
            }
            catch (Exception ex)
            {
                this.RecordEvent("UpdateCategory() - Failed to update category.", RequestType.Failed);
                this._logger.LogError(ex, $"UpdateCategory() execution failed for the following details - {JsonConvert.SerializeObject(categoryModel, Formatting.Indented)}");
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #region TOGGLE ISACTIVE CATEGORY

        [HttpPost]
        [Route("toggleIsActiveCategory")]
        public async Task<IActionResult> ToggleIsActiveCategory(CategoryModel categoryModel)
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                if (categoryModel != null &&
                    categoryModel.CategoryId != 0)
                {
                    var response = await this._categoryData.ToggleIsActiveCategory(categoryModel);

                    sw.Stop();
                    TimeSpan ts = sw.Elapsed;

                    this.RecordEvent("ToggleIsActiveCategory() - Succeeded to update category.", RequestType.Succeeded);
                    this._logger.LogInformation($"ToggleIsActiveCategory() executed successfully for category id - {categoryModel.CategoryId} in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10));

                    if (response == null) return this.NotFound(); // 404

                    response.ExecutionTime = $"ToggleIsActiveCategory() executed successfully for category id - {categoryModel.CategoryId} in - "
                        + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                        ts.Hours, ts.Minutes, ts.Seconds,
                        ts.Milliseconds / 10);

                    return this.Ok(response);
                }
                else
                {
                    return this.NotFound(); // 404
                }
            }
            catch (Exception ex)
            {
                this.RecordEvent("ToggleIsActiveCategory() - Failed to update category.", RequestType.Failed);
                this._logger.LogError(ex, $"ToggleIsActiveCategory() execution failed for the following details - {JsonConvert.SerializeObject(categoryModel, Formatting.Indented)}");
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #region GETALL CATEGORY

        [HttpPost]
        [Route("getAllCategory")]
        public async Task<IActionResult> GetAllCategory(CategoryModel categoryModel)
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                var response = await this._categoryData.GetAllCategory(categoryModel);

                sw.Stop();
                TimeSpan ts = sw.Elapsed;

                this._logger.LogInformation("GetAllCategory() executed successfully in - "
                    + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds / 10));

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetAllCategory() - Failed to execute.", RequestType.Failed);
                if (categoryModel != null)
                {
                    this._logger.LogError(ex, $"GetAllCategory() execution failed for the following details - {JsonConvert.SerializeObject(categoryModel, Formatting.Indented)}");
                }
                else
                {
                    this._logger.LogError(ex, $"GetAllCategory() execution failed");
                }
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #region GETBYID CATEGORY

        [HttpGet]
        [Route("getCategoryById")]
        public async Task<IActionResult> GetCategoryById(long Id)
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                var categoryModel = new CategoryModel();
                categoryModel.CategoryId = Id;

                var response = await this._categoryData.GetCategoryById(categoryModel);

                sw.Stop();
                TimeSpan ts = sw.Elapsed;

                this._logger.LogInformation($"GetCategoryById() executed successfully for category id {Id} in - "
                    + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds / 10));

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetCategoryById() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"GetCategoryById() execution failed for category id {Id}");
                return this.Problem(ex.Message);
            }
        }

        #endregion
    }
}
