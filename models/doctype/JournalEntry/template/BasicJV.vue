<template>
  <div class="border h-full">
    <div>
      <div class="px-6 pt-6" v-if="printSettings && accountingSettings">
        <div class="flex text-sm text-gray-900 pb-4">
          <div class="w-1/3">
            <div v-if="printSettings.displayLogo">
              <img
                class="h-12 max-w-32 object-contain"
                :src="printSettings.logo"
              />
            </div>
            <div class="text-xl text-gray-700 font-semibold" v-else>
              {{ accountingSettings.companyName }}
            </div>
          </div>
          <div class="w-1/3">
            <div>{{ printSettings.email }}</div>
            <div class="mt-1">{{ printSettings.phone }}</div>
          </div>
          <div class="w-1/3">
            <div v-if="address">{{ address.addressDisplay }}</div>
          </div>
        </div>
      </div>
      <div class="mt-8 px-6">
        <div class="flex justify-between">
          <div class="w-1/3">
            <h1 class="text-2xl font-semibold">
              {{ doc.name }}
            </h1>
            <div class="py-2 text-base"></div>
          </div>
          <div class="w-1/3">
            <div class="py-1 text-right text-lg font-semibold"></div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="doc"
      class="flex justify-center flex-1 mb-8 mt-2"
      :class="doc.submitted && 'pointer-events-none'"
    >
      <div class="   h-full flex flex-col justify-between">
        <div>
          <div class="mt-8 px-6">
            <div class="flex justify-between mt-2">
              <div class="w-1/3">
                <div class="py-1 text-left text-lg font-semibold">
                  {{ doc.entryType }}
                </div>
              </div>
              <div class="w-1/3">
                <div class="py-1 text-left text-lg font-semibold">
                  Ref #: {{ doc.referenceNumber }}
                </div>

                <div class="py-1 text-left text-lg font-semibold">
                  Date: {{ doc.date }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 px-6 text-base">
            <FormControl
              :df="meta.getField('accounts')"
              :value="doc.accounts"
              :showHeader="true"
              @change="value => doc.set('accounts', value)"
              :read-only="doc.submitted"
            />
          </div>
        </div>
        <div class="px-6 ">
          <div
            class="grid items-center border-t pt-3 pr-2"
            style="grid-template-columns: 1.3fr 1fr 1fr"
          >
            <div class="text-sm">
              {{ doc.userRemark }}
            </div>
            <div class="text-right font-semibold  px-3">
              {{ totalDebit }}
            </div>
            <div class="text-right font-semibold  px-3">
              {{ totalCredit }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';

import FormControl from '@/components/Controls/FormControl';

export default {
  name: 'JournalEntryForm',
  props: ['doc', 'printSettings'],
  components: {
    FormControl
  },
  provide() {
    return {
      doctype: 'JournalEntry',
      name: this.name
    };
  },
  data() {
    return {
      doctype: 'JournalEntry',

      accountingSettings: null
    };
  },
  computed: {
    meta() {
      return frappe.getMeta(this.doctype);
    },
    address() {
      return this.printSettings && this.printSettings.getLink('address');
    },
    totalDebit() {
      let value = 0;
      if (this.doc.accounts) {
        value = this.doc.getSum('accounts', 'debit');
      }
      return frappe.format(value, 'Currency');
    },
    totalCredit() {
      let value = 0;
      if (this.doc.accounts) {
        value = this.doc.getSum('accounts', 'credit');
      }
      return frappe.format(value, 'Currency');
    }
  },
  async mounted() {
    this.accountingSettings = await frappe.getSingle('AccountingSettings');
    await this.printSettings.loadLink('address');
    this.companyAddress = this.printSettings.getLink('address');

    //this.doc = await frappe.getDoc(this.doctype, this.name);
  }
};
</script>
