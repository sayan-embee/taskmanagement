using System.Threading.Tasks;
using TeamsApp.Common.Models.Enum;
using TeamsApp.Common.Models;
using System.Collections.Generic;

namespace TeamsApp.DataAccess.Data
{
    public interface ICategoryData
    {
        /// <summary>
        /// InsertCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>ReturnMessageModel</returns>
        Task<ReturnMessageModel> InsertCategory(CategoryModel categoryModel);
        /// <summary>
        /// UpdateCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>ReturnMessageModel</returns>
        Task<ReturnMessageModel> UpdateCategory(CategoryModel categoryModel);
        /// <summary>
        /// ToggleIsActiveCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>ReturnMessageModel</returns>
        Task<ReturnMessageModel> ToggleIsActiveCategory(CategoryModel categoryModel);
        /// <summary>
        /// GetAllCategory
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>IEnumerable<CategoryModel></returns>
        Task<IEnumerable<CategoryModel>> GetAllCategory(CategoryModel categoryModel);
        /// <summary>
        /// GetCategoryById
        /// </summary>
        /// <param name="categoryModel"></param>
        /// <returns>CategoryModel</returns>
        Task<CategoryModel> GetCategoryById(CategoryModel categoryModel);
    }
}