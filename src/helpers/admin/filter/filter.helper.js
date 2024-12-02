export class FilterHelper {
    /**
     * Xử lý filter trước khi gửi request
     * @param {Object} rawFilter - Filter gốc cần xử lý
     * @returns {Object} Filter đã được xử lý
     */
    static processFilter(rawFilter) {
        if (!rawFilter || typeof rawFilter !== 'object') {
            return {};
        }

        // Loại bỏ các giá trị không hợp lệ
        const cleanFilter = Object.fromEntries(
            Object.entries(rawFilter)
                .filter(([_, value]) => this.isValidValue(value))
        );

        // Xử lý các giá trị đặc biệt
        const processedFilter = Object.entries(cleanFilter)
            .reduce((acc, [key, value]) => ({
                ...acc,
                [key]: this.processValue(value)
            }), {});

        return processedFilter;
    }

    /**
     * Kiểm tra giá trị có hợp lệ không
     */
    static isValidValue(value) {
        // Kiểm tra null/undefined
        if (value === null || value === undefined) {
            return false;
        }

        // Kiểm tra string rỗng
        if (typeof value === 'string' && !value.trim()) {
            return false;
        }

        // Kiểm tra array rỗng
        if (Array.isArray(value) && value.length === 0) {
            return false;
        }

        // Kiểm tra object rỗng
        if (typeof value === 'object' && !Array.isArray(value) && 
            Object.keys(value).length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Xử lý giá trị dựa vào kiểu dữ liệu
     */
    static processValue(value) {
        // Xử lý array
        if (Array.isArray(value)) {
            return value.join(',');
        }

        // Xử lý date
        if (value instanceof Date) {
            return value.toISOString();
        }

        // Xử lý object
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        // Các kiểu dữ liệu khác giữ nguyên
        return value;
    }

    /**
     * Format filter để hiển thị trên URL
     */
    static formatFilterForUrl(filter) {
        return Object.entries(filter)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
    }

    /**
     * Parse filter từ URL search params
     */
    static parseFilterFromUrl(searchParams) {
        const filter = {};
        for (const [key, value] of searchParams.entries()) {
            // parse array
            if (value.includes(',')) {
              filter[key] = value.split(',').map(item => {
                  // Kiểm tra nếu item có thể chuyển thành số
                  if (!isNaN(item)) {
                      return Number(item);
                  }
                  return item;
              });
              continue;
            }

            // parse number
            if (!isNaN(value)) {
                filter[key] = Number(value);
                continue;
            }

            // parse boolean 
            if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                filter[key] = value.toLowerCase() === 'true';
                continue;
            }

            // Các trường hợp còn lại giữ nguyên string
            filter[key] = value;
        }
        return filter;
    }
}
