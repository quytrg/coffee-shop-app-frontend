// src/stores/productStore.js
import { defineStore } from 'pinia';
import ProductService from '@/services/admin/product.service';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    filterParams: {
      status: '',
      keyword: '',
      categoryIds: [],
      imageURL: null,
      page: 1,
      size: 10, // Số sản phẩm trên mỗi trang
    },
  }),

  getters: {
    // Lấy sản phẩm theo ID
    getProductById: (state) => {
      return (id) => state.products.find(product => product.id === id);
    },

    // Lọc sản phẩm theo danh mục
    productsByCategory: (state) => {
      return (categoryId) => state.products.filter(product => product.categoryId === categoryId);
    },
  },

  actions: {
    // Helper để chuẩn hóa dữ liệu sản phẩm
    normalizeProduct(product) {
      return {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        imageURL: product.imageURL,
        status: product.status,
        // Thêm các trường cần thiết khác ở đây
        // Ví dụ: description, price, createdAt, updatedAt, v.v.
      };
    },

    // Fetch sản phẩm với các tham số filter
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await ProductService.get({
          params: {
            ...this.filterParams,
            page: this.currentPage - 1, // Giả sử API sử dụng 0-based index
          }
        });
        this.products = response.data.content.map(this.normalizeProduct);
        this.totalPages = response.data.page.totalPages;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = 'Failed to load products.';
      } finally {
        this.isLoading = false;
      }
    },

    // Thêm mới sản phẩm
    async addProduct(newProduct) {
      try {
        const response = await ProductService.create(newProduct);
        const normalizedProduct = this.normalizeProduct(response.data);
        this.products.unshift(normalizedProduct); // Thêm vào đầu mảng
      } catch (error) {
        console.error("Error adding product:", error);
        this.error = 'Failed to add product.';
        throw error;
      }
    },

    // Cập nhật sản phẩm
    async updateProduct(updatedProduct) {
      try {
        await ProductService.update(updatedProduct.id, updatedProduct);
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = this.normalizeProduct(updatedProduct);
        }
      } catch (error) {
        console.error("Error updating product:", error);
        this.error = 'Failed to update product.';
        throw error;
      }
    },

    // Xóa sản phẩm
    async deleteProduct(productId) {
      try {
        await ProductService.deleteOne(productId);
        this.products = this.products.filter(product => product.id !== productId);
      } catch (error) {
        console.error("Error deleting product:", error);
        this.error = 'Failed to delete product.';
        throw error;
      }
    },

    // Cập nhật các tham số filter
    setFilter(params) {
      this.filterParams = { ...this.filterParams, ...params };
      this.currentPage = 1; // Reset về trang đầu khi filter thay đổi
      this.fetchProducts();
    },

    // Cập nhật trang hiện tại
    setPage(page) {
      this.currentPage = page;
      this.fetchProducts();
    },

    // Reset filter
    resetFilter() {
      this.filterParams = {
        status: '',
        keyword: '',
        categoryIds: [],
        imageURL: null,
        page: 1,
        size: 10,
      };
      this.currentPage = 1;
      this.fetchProducts();
    },
  },
});
