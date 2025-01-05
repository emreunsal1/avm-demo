import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  password,
  relationship,
  timestamp,
  select,
  decimal,
} from '@keystone-6/core/fields';

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      role: select({
        type: 'enum',
        options: [
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Manager', value: 'MANAGER' },
          { label: 'Store Owner', value: 'STORE_OWNER' },
        ],
        defaultValue: 'STORE_OWNER',
        validation: { isRequired: true },
      }),
      store: relationship({ ref: 'Store.owner', many: false }),
      managedMall: relationship({ ref: 'Mall.manager', many: false }),
      payments: relationship({ ref: 'Payment.user', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        db: {
          updatedAt: true,
        },
      }),
    },
  }),

  Mall: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      stores: relationship({ ref: 'Store.mall', many: true }),
      manager: relationship({ ref: 'User.managedMall', many: false }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        db: {
          updatedAt: true,
        },
      }),
    },
  }),

  Store: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      rentAmount: decimal({
        validation: { isRequired: true },
        scale: 4,
        precision: 18,
      }),
      mall: relationship({
        ref: 'Mall.stores',
        many: false,
      }),
      owner: relationship({
        ref: 'User.store',
        many: false,
      }),
      payments: relationship({ ref: 'Payment.store', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        db: {
          updatedAt: true,
        },
      }),
    },
  }),

  Payment: list({
    access: allowAll,
    fields: {
      amount: decimal({
        validation: { isRequired: true },
        scale: 4,
        precision: 18,
      }),
      store: relationship({
        ref: 'Store.payments',
        many: false,
      }),
      user: relationship({
        ref: 'User.payments',
        many: false,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        db: {
          updatedAt: true,
        },
      }),
    },
  }),
}; 