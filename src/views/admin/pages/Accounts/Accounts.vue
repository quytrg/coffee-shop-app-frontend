<template>
  <div class="accounts fluid-container mx-5" v-if="checkPermission('USER_VIEW')">
    <div class="accounts-wrapper position-relative" v-if="!isFetching">
      <!-- Tiêu đề -->
      <div class="accounts-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Accounts</h4>
      </div>

      <!-- Alert -->
      <Transition name="slide-fade">
        <v-alert
          v-if="alert"
          text="You need permission to perform this action"
          border-color="warning"
          color="warning"
          width="480px"
          border="start"
          variant="tonal"
          density="compact"
          icon="$warning"
          closable
          @input="alert = false"
          class="alert position-absolute top-0 end-0 z-99"
        ></v-alert>
      </Transition>

      <!-- Filters -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-0 mt-ms-auto d-flex align-items-center">Filters</h5>
          <div @click="handleClear" class="icon" style="cursor: pointer;">
            <i class="fa-solid fa-filter-circle-xmark fa-lg"></i>
          </div>
        </div>
        <div class="card-body">
          <!-- Các trường lọc cơ bản -->
          <div class="row mb-3">
            <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
              <v-select
                :items="statusOptions"
                label="Status"
                density="compact"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
                hide-details
                v-model="filter.status" 
              />
            </div>
            <div class="col-lg-6 col-md-12">
              <Search 
                v-model:keyword="filter.keyword"
              />
            </div>
          </div>

          <!-- Các bộ lọc mở rộng -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel title="Advanced Filters">
              <v-expansion-panel-text>
                <div class="row">
                  <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
                    <v-select
                      :items="roleOptions"
                      label="Roles"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      hide-details
                      multiple
                      v-model="filter.roleIds"
                    />
                  </div>
                  <div class="col-lg-6 col-md-12">
                    <v-select
                      :items="sexOptions"
                      label="Sex"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      hide-details
                      v-model="filter.sex" 
                    />
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Các tiêu chí sắp xếp động -->
          <div class="row mb-3">
            <div class="col-12">
              <h5>Sort Criteria</h5>
              <div 
                v-for="(criteria, index) in sortCriteria" 
                :key="index" 
                class="d-flex mb-2 align-items-center sort-criteria-row"
              >
                <v-select
                  :items="sortFieldOptions"
                  label="Sort Field"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="criteria.sortBy"
                  class="flex-fill me-2"
                />
                <v-select
                  :items="sortDirectionOptions"
                  label="Sort Direction"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="criteria.sortDir"
                  class="flex-fill me-2"
                />
                <button 
                  @click="removeSortCriteria(index)" 
                  class="btn btn-danger sort-remove-button"
                  :disabled="sortCriteria.length === 1"
                  title="Remove Sort Criteria"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
              <button @click="addSortCriteria" class="btn btn-primary">
                <i class="fa-solid fa-plus"></i> Add Sort
              </button>
            </div>
          </div>

          <!-- Nút Thực Hiện Lọc -->
          <div class="row mb-3">
            <div class="col-12 text-end">
              <button @click="getAccounts" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounts List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Accounts</h5>
        </div>
        <div class="card-body">
          <div class="accounts-action d-flex justify-content-between mb-3">
            <!-- <ChangeMulti @apply="handleChangeMulti"/> -->
            <div></div>
            <router-link :to="{ name: 'CreateAccount' }">
              <button class="btn btn-main btn-primary">+ New Account</button>
            </router-link>
          </div>
          <table class="table table-sm mt-3">
            <thead>
              <tr>
                <th>
                  <input
                    class="form-check-input" 
                    type="checkbox"
                    name="checkall"
                    @change="handleCheckAll"
                    v-model="checkall"
                  >
                </th>
                <th>STT</th>
                <th>Image</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="accounts.length">
              <tr v-for="(account, index) in accounts" :key="account.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="account.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>
                  <div class="thumbnail">
                    <img 
                      :src="account.imageUrls[0] ? account.imageUrls[0] : '/default-profile-avatar.jpg'" 
                      :alt="account.fullName"
                    >
                  </div>
                </td>
                <td>{{ account.fullName }}</td>
                <td>{{ account.phoneNumber }}</td>
                <td>{{ account.email }}</td>
                <td>{{ account.roleName }}</td>
                <td>
                  <v-chip :color="getStatusClass(account.status)">
                    {{ getStatusLabel(account.status) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex icon">
                    <router-link 
                      :to="{ name: 'ModifyAccount', params: { id: `${account.id}`} }"
                      class="d-flex align-items-center me-2"
                      title="Modify Account"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link>
                    <div
                      @click="handleDelete(account.id)"
                      class="cursor-pointer"
                      title="Delete Account"
                    >
                      <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="9">
                  <div class="text-center">
                    No result.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div class="text-center">
            <v-container>
              <v-row justify="center">
                <v-col cols="8">
                  <v-container class="max-width p-0">
                    <v-pagination
                      v-model="page"
                      :length="totalPages"
                      :total-visible="6"
                      @input="handlePageChange"
                    ></v-pagination>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
    </div>

    <div class="accounts-wrapper" v-else>
      <!-- Skeleton Loaders khi đang fetch dữ liệu -->
      <v-row>
        <v-col cols="6">
          <v-skeleton-loader
            color="grey-lighten-5"
            class="my-2"
            max-width="400"
            type="heading"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div class="card-body">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="300"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="400"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div class="card-body">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="300"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="400"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
          <table class="table table-sm mt-3">
            <thead>
              <tr>
                <th colspan="12">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row"
                  ></v-skeleton-loader>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="12">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row-divider@6"
                  ></v-skeleton-loader>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <v-container>
              <v-row justify="center">
                <v-col cols="8" class="p-0">
                  <v-container class="max-width p-0">
                    <v-skeleton-loader
                      class="mx-auto"
                      max-width="300"
                      type="heading"
                    ></v-skeleton-loader>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="accounts fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import FilterStatus from '@/components/admin/FilterStatus/FilterStatus.vue'
import Search from '@/components/admin/Search/Search.vue'
// import ChangeMulti from '@/components/admin/ChangeMulti/ChangeMulti.vue' 
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import Select from '@/components/admin/Select/Select.vue'
import accountService from '@/services/admin/account.service'
import roleService from '@/services/admin/role.service'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js'
import { AccountStatus, AccountSortField } from '@/enums/account.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'
import { RoleStatus } from '@/enums/role.enum.js'

export default {
  name: "Accounts",
  components: {
    FilterStatus,
    Search,
    // ChangeMulti,
    Unauthorized,
    Select
  },
  data() {
    return {
      accounts: [],
      filter: {
        status: '',
        keyword: '',
        roleIds: [],
        sex: '',
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Sử dụng sortCriteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      statusOptions: AccountStatus.toArray(),
      sortFieldOptions: AccountSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      roleOptions: [], // Danh sách vai trò để lọc
      sexOptions: [
        { label: 'Male', value: true },
        { label: 'Female', value: false },
      ],
    }
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName)
    },
    async getAccounts() {
      const processedFilter = FilterHelper.processFilter(this.filter);
      // Chuyển đổi sortCriteria thành sortBy và sortDir arrays
      const sortBy = this.sortCriteria.map(criteria => criteria.sortBy).filter(Boolean);
      const sortDir = this.sortCriteria.map(criteria => criteria.sortDir).filter(Boolean);
      console.log(processedFilter, sortBy, sortDir)
      try {
        const params = {
          ...processedFilter,
          page: this.page - 1
        }

        if (sortBy.length !== 0) {
          params.sortBy = sortBy.join(',')
        }

        if (sortDir.length !== 0) {
          params.sortDir = sortDir.join(',')
        }
        console.log(params)
        const response = await accountService.getAll({
          params: params
        })
        console.log(response)
        this.accounts = response.data.content
        this.totalPages = response.data.page.totalPages
        this.isFetching = false

        // update url
        this.updateURL(processedFilter)
      } catch (error) {
        console.error(error)
        this.isFetching = false
        // Có thể hiển thị thông báo lỗi cho người dùng
      }
    },
    async getRoleOptions() {
      try {
        const response = await roleService.getAll({
          params: { page: 0, size: 100, status: RoleStatus.ACTIVE }
        })
        this.roleOptions = response.data.content.map(role => ({
          label: role.name,
          value: role.id
        }))
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    },
    updateURL(processedFilter) {
      const query = {
        ...processedFilter,
        page: this.page,
      };

      if (this.sortCriteria[0].sortBy !== '') {
        query.sortBy = this.sortCriteria.map(c => c.sortBy).join(',')
      }

      if (this.sortCriteria[0].sortDir !== '') {
        query.sortDir = this.sortCriteria.map(c => c.sortDir).join(',')
      }

      this.$router.push({ query });
    },
    handleClear() {
      this.filter = {
        status: '',
        keyword: '',
        roleIds: [],
        sex: '',
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getAccounts()
    },
    handleCheckAll() {  
      this.checkedItems = this.accounts.map(() => this.checkall)
    },
    async handleDelete(id) {
      try {
        if (this.checkPermission('delete_accounts')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await accountService.deleteOne(id)
              this.getAccounts()
              successDialogHelper()
            }
          });
        }
        else {
          this.alert = true
          setTimeout(() => {
            this.alert = false
          }, 1200)
        }
      }
      catch (err) {
        console.log(err)
      }
    },
    // async handleChangeStatus(account) {
    //   const changeStatusTo = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    //   try {
    //     await accountService.update(account.id, { status: changeStatusTo })
    //     account.status = changeStatusTo
    //     successDialogHelper("Status Changed", `Account status has been changed to ${changeStatusTo}`)
    //   } catch (error) {
    //     console.error(error)
    //     this.alert = true
    //     setTimeout(() => {
    //       this.alert = false
    //     }, 1200)
    //   }
    // },
    getStatusClass(status) {
      const config = AccountStatus.getConfig(status);
      return `${config.color}`;
    },
    getStatusLabel(status) {
      return AccountStatus.getLabel(status);
    },
    // Khôi phục filter từ URL khi load page
    initFilterFromUrl() {
      const searchParams = new URLSearchParams(window.location.search);
      this.filter = FilterHelper.parseFilterFromUrl(searchParams);
      
      // Khôi phục sortCriteria từ URL
      const sortByParam = searchParams.get('sortBy');
      const sortDirParam = searchParams.get('sortDir');
      if (sortByParam && sortDirParam) {
        const sortByArray = sortByParam.split(',');
        const sortDirArray = sortDirParam.split(',');
        this.sortCriteria = sortByArray.map((field, index) => ({
          sortBy: field,
          sortDir: sortDirArray[index] || '',
        }));
      }
      else {
        this.sortCriteria = [ { sortBy: '', sortDir: '' } ];
      }
    },
    // Thêm tiêu chí sắp xếp
    addSortCriteria() {
      this.sortCriteria.push({ sortBy: '', sortDir: '' });
    },
    // Xóa tiêu chí sắp xếp
    removeSortCriteria(index) {
      if (this.sortCriteria.length > 1) {
        this.sortCriteria.splice(index, 1);
      }
    },
    // Xử lý thay đổi trang
    handlePageChange(newPage) {
      this.page = newPage;
    }
  },
  mounted() {
    this.initFilterFromUrl();
    this.getRoleOptions();
    this.getAccounts();
  },
  watch: {
    filter: {
      handler() {
        this.page = 1
      },
      deep: true
    },
    sortCriteria: {
      handler() {
        this.page = 1
      },
      deep: true
    },
    page() {
      this.getAccounts()
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">

.sort-criteria-row {
  gap: 8px;
}

v-expansion-panels {
  box-shadow: none !important;
}

@media (max-width: 960px) {
  .d-flex:not(.accounts-title, .card-header) {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .sort-criteria-row {
    flex-direction: column;
  }

  .sort-criteria-row .flex-fill {
    width: 100%;
  }

  .sort-remove-button {
    align-self: flex-end;
  }

  .accounts-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
