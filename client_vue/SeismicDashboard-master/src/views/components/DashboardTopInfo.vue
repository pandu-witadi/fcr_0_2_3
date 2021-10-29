<template>
<!--  <CRow>-->
<!--    <CCol sm="6" lg="3">-->
<!--      <CWidgetDropdown color="primary" header="9.823" text="Members online">-->
<!--        <template #default>-->
<!--          <CDropdown-->
<!--            color="transparent p-0"-->
<!--            placement="bottom-end"-->
<!--          >-->
<!--            <template #toggler-content>-->
<!--              <CIcon name="cil-settings"/>-->
<!--            </template>-->
<!--            <CDropdownItem>Action</CDropdownItem>-->
<!--            <CDropdownItem>Another action</CDropdownItem>-->
<!--            <CDropdownItem>Something else here...</CDropdownItem>-->
<!--            <CDropdownItem disabled>Disabled action</CDropdownItem>-->
<!--          </CDropdown>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--&lt;!&ndash;          <CChartLineSimple&ndash;&gt;-->
<!--&lt;!&ndash;            pointed&ndash;&gt;-->
<!--&lt;!&ndash;            class="mt-3 mx-3"&ndash;&gt;-->
<!--&lt;!&ndash;            style="height:70px"&ndash;&gt;-->
<!--&lt;!&ndash;            :data-points="[65, 59, 84, 84, 51, 55, 40]"&ndash;&gt;-->
<!--&lt;!&ndash;            point-hover-background-color="primary"&ndash;&gt;-->
<!--&lt;!&ndash;            label="Members"&ndash;&gt;-->
<!--&lt;!&ndash;            labels="months"&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--        </template>-->
<!--      </CWidgetDropdown>-->
<!--    </CCol>-->
<!--    <CCol sm="6" lg="3">-->
<!--      <CWidgetDropdown color="info" header="9.823" text="Members online">-->
<!--        <template #default>-->
<!--          <CDropdown-->
<!--            color="transparent p-0"-->
<!--            placement="bottom-end"-->
<!--            :caret="false"-->
<!--          >-->
<!--            <template #toggler-content>-->
<!--              <CIcon name="cil-location-pin"/>-->
<!--            </template>-->
<!--            <CDropdownItem>Action</CDropdownItem>-->
<!--            <CDropdownItem>Another action</CDropdownItem>-->
<!--            <CDropdownItem>Something else here...</CDropdownItem>-->
<!--            <CDropdownItem disabled>Disabled action</CDropdownItem>-->
<!--          </CDropdown>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--&lt;!&ndash;          <CChartLineSimple&ndash;&gt;-->
<!--&lt;!&ndash;            pointed&ndash;&gt;-->
<!--&lt;!&ndash;            class="mt-3 mx-3"&ndash;&gt;-->
<!--&lt;!&ndash;            style="height:70px"&ndash;&gt;-->
<!--&lt;!&ndash;            :data-points="[1, 18, 9, 17, 34, 22, 11]"&ndash;&gt;-->
<!--&lt;!&ndash;            point-hover-background-color="info"&ndash;&gt;-->
<!--&lt;!&ndash;            :options="{ elements: { line: { tension: 0.00001 }}}"&ndash;&gt;-->
<!--&lt;!&ndash;            label="Members"&ndash;&gt;-->
<!--&lt;!&ndash;            labels="months"&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--        </template>-->
<!--      </CWidgetDropdown>-->
<!--    </CCol>-->
<!--    <CCol sm="6" lg="3">-->
<!--      <CWidgetDropdown-->
<!--        color="warning"-->
<!--        header="9.823"-->
<!--        text="Members online"-->
<!--      >-->
<!--        <template #default>-->
<!--          <CDropdown-->
<!--            color="transparent p-0"-->
<!--            placement="bottom-end"-->
<!--          >-->
<!--            <template #toggler-content>-->
<!--              <CIcon name="cil-settings"/>-->
<!--            </template>-->
<!--            <CDropdownItem>Action</CDropdownItem>-->
<!--            <CDropdownItem>Another action</CDropdownItem>-->
<!--            <CDropdownItem>Something else here...</CDropdownItem>-->
<!--            <CDropdownItem disabled>Disabled action</CDropdownItem>-->
<!--          </CDropdown>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--&lt;!&ndash;          <CChartLineSimple&ndash;&gt;-->
<!--&lt;!&ndash;            class="mt-3"&ndash;&gt;-->
<!--&lt;!&ndash;            style="height:70px"&ndash;&gt;-->
<!--&lt;!&ndash;            background-color="rgba(255,255,255,.2)"&ndash;&gt;-->
<!--&lt;!&ndash;            :data-points="[78, 81, 80, 45, 34, 12, 40]"&ndash;&gt;-->
<!--&lt;!&ndash;            :options="{ elements: { line: { borderWidth: 2.5 }}}"&ndash;&gt;-->
<!--&lt;!&ndash;            point-hover-background-color="warning"&ndash;&gt;-->
<!--&lt;!&ndash;            label="Members"&ndash;&gt;-->
<!--&lt;!&ndash;            labels="months"&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--        </template>-->
<!--      </CWidgetDropdown>-->
<!--    </CCol>-->
<!--    <CCol sm="6" lg="3">-->
<!--      <CWidgetDropdown-->
<!--        color="danger"-->
<!--        header="9.823"-->
<!--        text="Members online"-->
<!--      >-->
<!--        <template #default>-->
<!--          <CDropdown-->
<!--            color="transparent p-0"-->
<!--            placement="bottom-end"-->
<!--          >-->
<!--            <template #toggler-content>-->
<!--             <CIcon name="cil-settings"/>-->
<!--            </template>-->
<!--            <CDropdownItem>Action</CDropdownItem>-->
<!--            <CDropdownItem>Another action</CDropdownItem>-->
<!--            <CDropdownItem>Something else here...</CDropdownItem>-->
<!--            <CDropdownItem disabled>Disabled action</CDropdownItem>-->
<!--          </CDropdown>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--&lt;!&ndash;          <CChartBarSimple&ndash;&gt;-->
<!--&lt;!&ndash;            class="mt-3 mx-3"&ndash;&gt;-->
<!--&lt;!&ndash;            style="height:70px"&ndash;&gt;-->
<!--&lt;!&ndash;            background-color="rgb(250, 152, 152)"&ndash;&gt;-->
<!--&lt;!&ndash;            label="Members"&ndash;&gt;-->
<!--&lt;!&ndash;            labels="months"&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--        </template>-->
<!--      </CWidgetDropdown>-->
<!--    </CCol>-->
<!--  </CRow>-->
</template>

<script>
// import { CChartLineSimple, CChartBarSimple } from '../charts/index.js'

export default {
  name: 'DashboardTopInfo',
  // components: { CChartLineSimple, CChartBarSimple }
}
</script>
