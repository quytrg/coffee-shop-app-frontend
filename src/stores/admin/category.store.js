
import { defineStore } from 'pinia';
import CategoryService from '@/services/admin/category.service'; 
import { CategoryStatus } from '@/enums/category.enum.js'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    // Lấy danh mục theo ID
    getCategoryById: (state) => {
      return (id) => state.categories.find(category => category.id === id);
    },

    // Lấy danh mục đang hoạt động
    activeCategories: (state) => state.categories.filter(category => category.status === CategoryStatus.ACTIVE),
  },

  actions: {
    // Helper để chuẩn hóa dữ liệu danh mục
    normalizeCategory(category) {
      return {
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status,
        imageUrls: category.imageUrls
      };
    },
    // Fetch tất cả các danh mục
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await CategoryService.getAll({
          params: {
            size: 50,
            status: CategoryStatus.ACTIVE
          }
        });
        this.categories = response.data.content;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.error = 'Failed to load categories.';
      } finally {
        this.isLoading = false;
      }
    },

    // Thêm mới danh mục
    async addCategory(newCategory) {
      try {
        const response = await CategoryService.create(newCategory);
        // Chuẩn hóa dữ liệu trước khi thêm vào store
        const normalizedCategory = this.normalizeCategory(response.data);
        this.categories.push(normalizedCategory);
      } catch (error) {
        console.error("Error adding category:", error);
        this.error = 'Failed to add category.';
        throw error; 
      }
    },

    // Cập nhật danh mục
    async updateCategory(updatedCategory) {
      try {
        await CategoryService.update(updatedCategory.id, updatedCategory);
        const index = this.categories.findIndex(category => category.id === updatedCategory.id);
        if (index !== -1) {
          this.categories[index] = this.normalizeCategory(updatedCategory);
        }
      } catch (error) {
        console.error("Error updating category:", error);
        this.error = 'Failed to update category.';
        throw error;
      }
    },

    // Xóa danh mục
    async deleteCategory(categoryId) {
      try {
        await CategoryService.deleteOne(categoryId);
        this.categories = this.categories.filter(category => category.id !== categoryId);
      } catch (error) {
        console.error("Error deleting category:", error);
        this.error = 'Failed to delete category.';
        throw error;
      }
    },
  },
});
