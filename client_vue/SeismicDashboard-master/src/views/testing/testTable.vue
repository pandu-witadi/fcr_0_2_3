<template>
  <div>
<!--    <ejs-grid :dataSource='data' :allowGrouping='true' :allowFiltering='true' :allowPaging="true"-->
<!--              :pageSettings='pageSettings' height='75vh'>-->
<!--      <e-columns>-->
<!--        &lt;!&ndash;        <e-column headerText='Order Status' :template="customerIDHeaderTemplate" width=200></e-column>&ndash;&gt;-->
<!--        &lt;!&ndash;        <e-column type='checkbox' width='50'></e-column>&ndash;&gt;-->
<!--        &lt;!&ndash;        <e-column field='AutoIncrement' headerText='AutoIncrement' , type='number' , width='120'></e-column>&ndash;&gt;-->
<!--        <e-column field='test.id' headerText='Order ID' textAlign='Right' width=90></e-column>-->
<!--        <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=90></e-column>-->
<!--        <e-column field='CustomerID' headerText='Customer ID' width=120></e-column>-->
<!--        <e-column field='Freight' headerText='Freight' textAlign='Right' format='C2' width=90></e-column>-->
<!--        <e-column field='ShipName' headerText='Ship Name' width=120></e-column>-->
<!--      </e-columns>-->
<!--    </ejs-grid>-->

    <div>
<!--      {{ selectedIds }}-->
<!--      <button @click="rows = [];">empty row</button>-->
<!--      <button @click="resetTable">reset Table</button>-->
<!--      <button @click="hideColumn">hide column</button>-->
<!--      <button @click="setFilter">SetFilter</button>-->
<!--      <button @click="changePage">Change Page</button>-->
<!--      <input type="text" v-model="searchTerm">-->
      <vue-good-table
        compactMode
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table condensed"
        :line-numbers="true"
        :pagination-options="paginationOptions"
        :select-options="tableSelectAllOptions"
        @on-select-all="onSelectAll">
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field === 'age'">
            <i class="btn_toolbar fa fa-toggle-on"/>
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import {GridPlugin, Group, Filter, Page} from "@syncfusion/ej2-vue-grids";

  // import the styles
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table';
  Vue.use(GridPlugin);
  import MyEmployeeTemplate from "./MyEmployeeTemplate";

  export default {
    name: "testTable",
    provide: {
      grid: [Group, Filter, Page]
    },
    components: {
      MyEmployeeTemplate,
      VueGoodTable
    },
    data: () => {
      return {
        customerIDHeaderTemplate: function (e) {
          return {
            template: MyEmployeeTemplate,
          };
        },
        pageSettings: {pageSizes: true, pageSize: 10},
        data: [
          {
            test: {id: 10},
            OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
            ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
            ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
          },
          // {
          //   OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
          //   ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
          //   ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
          // },
          // {
          //   OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
          //   ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
          //   ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
          // },
          // {
          //   OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
          //   ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
          //   ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
          // },
          // {
          //   OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8368506e5),
          //   ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
          //   ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
          // },
          // {
          //   OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 3, OrderDate: new Date(836937e6),
          //   ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
          //   ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
          // },
          // {
          //   OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
          //   ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
          //   ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
          // },
          // {
          //   OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
          //   ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
          //   ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
          // },
          // {
          //   OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
          //   ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
          //   ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
          // },
          // {
          //   OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
          //   ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
          //   ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
          // },
          // {
          //   OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
          //   ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
          //   ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
          // },
          // {
          //   OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 4, OrderDate: new Date(8376282e5),
          //   ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
          //   ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
          // },

        ],

        currentPage: 1,
        selectedIds: [],
        rowStyleClass: 'red',
        searchTerm: '',
        paginationOptions: {
          enabled: true,
          mode: 'records',
          perPage: 10,
          perPageDropdown: [5, 10, 25, 50, 100, 200, 1000],
          perPageDropdownEnabled: true,
          // infoFn: (params) => `alala ${params.firstRecordOnPage} to ${params.lastRecordOnPage} of ${params.totalRecords}`,
        },
        tableSelectAllOptions: {
          enabled: true,
          selectOnCheckboxOnly: false,
          disableSelectInfo: true},
        columns: [
          {
            label: 'Name',
            field: 'name',
            width: '200px',
            filterOptions: {
              enabled: true,
              placeholder: 'All',
              trigger: 'enter',
              // filterDropdownItems: ['Chris', 'Dan', 'Susan'],
              // filterValue: 'Chris',
            },
          },
          {
            label: 'Age',
            field: 'age',
            type: 'number',
            tooltip: 'Age tooltip',
            firstSortType: 'desc',
            filterOptions: {
              enabled: true,
              // filterDropdownItems: ['24', '16', '30'],
              styleClass: 'class1',
              trigger: 'enter',
              // filterDropdownItems: [
              //   {
              //     value: 24,
              //     text: '24',
              //   },
              //   {
              //     value: 16,
              //     text: '16',
              //   },
              // ],
            },
          },
          {
            sortable: false,
            label: 'Created On',
            field: 'createdAt',
            type: 'date',
            dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSS",
            dateOutputFormat: 'MM/dd/yyyy HH:mm:ss',
          },
          {
            label: 'Percent',
            field: 'score',
            type: 'percentage',
          },
          // {
          //   label: 'func',
          //   field: this.funcValue,
          //   type: 'number',
          // },
          // {
          //   label: 'Valid',
          //   field: this.fieldValid,
          //   type: 'boolean',
          //   filterOptions: {
          //     enabled: true,
          //     filterDropdownItems: [
          //       true,
          //       false,
          //     ],
          //   },
          // },
          // {
          //   label: 'Exact',
          //   field: this.fieldExact,
          //   filterOptions: {
          //     enabled: true,
          //     filterDropdownItems: [
          //       'match',
          //       'rematch',
          //     ],
          //   },
          // }
        ],
        rows: [
          // { id:1, name:"John", age: 20, createdAt: '2018-02-18T00:00:43-05:00',score: 0.03343 },
          {
            id: 2,
            name: 'Jane',
            age: 24,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: true,
            exact: 'match',
            average: 1
          },
          {
            id: 3,
            name: 'Angel',
            age: 16,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: true,
            exact: 'match',
            average: null
          },
          {
            id: 4,
            name: 'Chris',
            age: 55,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: false,
            exact: null
          },
          {
            id: 5,
            name: 'Dan',
            age: 40,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: null,
            exact: 'rematch',
            average: 2
          },
          {
            id: 5,
            name: '193.23',
            age: 20,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: null,
            exact: 'rematch',
            average: 3
          },
          {
            id: 5,
            name: 'Dan',
            age: 34,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: null,
            exact: null,
            average: 2
          },
          {
            id: 6,
            name: 'John',
            age: 20,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: true,
            exact: 'match',
            average: 1.5
          },
          {
            id: 7,
            name: 'Ángel',
            age: 20,
            createdAt: '2021-09-27T09:43:08.497000',
            score: null,
            bool: 'false',
            exact: null,
            average: 1
          },
          {
            id: 8,
            name: 'Susan',
            age: 16,
            createdAt: '2021-09-27T09:43:08.497000',
            score: 0.03343,
            bool: true,
            exact: 'rematch',
            average: 1
          },
        ],
      }
    },
    methods: {
      fieldValid(row) {
        return row.bool;
      },
      fieldExact(row) {
        return row.exact;
      },
      funcValue(row) {
        return row.age + 5;
      },
      onSearch(params) {
        console.log('on-search:');
        console.log(params);
      },
      onColumnFilter(params) {
        // { currentPage: 1, currentPerPage: 10, total: 5 }
        console.log('on-column-filters:');
        console.log(params);
      },
      onSelectAll(params) {
        console.log(params);
        // this.unselectAll();
        // if (params.selected) {
        //   for (let i = 0; i < params.selectedRows.length; i++) {
        //     // lets get the original index of the row
        //     const originalIndex = params.selectedRows[i].originalIndex;
        //     // now lets set that row's selected value to be true
        //     this.$set(this.rows[originalIndex], 'selected', true);
        //   }
        // }
      },
    }
  }
</script>

<style scoped>

</style>
