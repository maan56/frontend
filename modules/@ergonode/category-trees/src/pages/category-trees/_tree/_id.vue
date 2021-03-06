/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Page>
        <TitleBar
            :title="code"
            :is-read-only="isReadOnly">
            <template #prependHeader>
                <NavigateBackFab :previous-route="previousRoute" />
            </template>
            <template #mainAction>
                <template
                    v-for="(actionItem, index) in extendedMainAction">
                    <Component
                        :is="actionItem.component"
                        :key="index"
                        v-bind="bindingProps(actionItem)" />
                </template>
                <RemoveCategoryTreeButton />
            </template>
        </TitleBar>
        <HorizontalRoutingTabBar
            v-if="asyncTabs"
            :items="asyncTabs"
            :change-values="changeValues"
            :errors="errors" />
    </Page>
</template>

<script>
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import beforeRouteEnterMixin from '@Core/mixins/route/beforeRouteEnterMixin';
import beforeRouteLeaveMixin from '@Core/mixins/route/beforeRouteLeaveMixin';
import asyncTabsMixin from '@Core/mixins/tab/asyncTabsMixin';
import RemoveCategoryTreeButton from '@Trees/components/Buttons/RemoveCategoryTreeButton';
import PRIVILEGES from '@Trees/config/privileges';
import Page from '@UI/components/Layout/Page';
import HorizontalRoutingTabBar from '@UI/components/TabBar/Routing/HorizontalRoutingTabBar';
import TitleBar from '@UI/components/TitleBar/TitleBar';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'EditCategoryTree',
    components: {
        Page,
        TitleBar,
        HorizontalRoutingTabBar,
        RemoveCategoryTreeButton,
    },
    mixins: [
        asyncTabsMixin,
        beforeRouteEnterMixin,
        beforeRouteLeaveMixin,
    ],
    validate({
        params,
    }) {
        return /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(params.id);
    },
    async fetch({
        app,
        store,
        params,
    }) {
        await store.dispatch('categoryTree/getCategoryTree', {
            id: params.id,
            onError: () => {
                app.$addAlert({
                    type: ALERT_TYPE.ERROR,
                    message: 'Category tree hasn`t been fetched properly',
                });
            },
        });
    },
    computed: {
        ...mapState('categoryTree', [
            'code',
        ]),
        extendedMainAction() {
            return this.$getExtendSlot('@Trees/pages/category-trees/_tree/mainAction');
        },
        isReadOnly() {
            return this.$isReadOnly(PRIVILEGES.CATEGORY_TREE.namespace);
        },
    },
    beforeDestroy() {
        this.__clearListStorage();
        this.__clearStorage();
        this.__clearTranslationsStorage();
        this.__clearFeedbackStorage();
    },
    methods: {
        ...mapActions('list', {
            __clearListStorage: '__clearStorage',
        }),
        ...mapActions('categoryTree', [
            '__clearStorage',
        ]),
        ...mapActions('feedback', {
            __clearFeedbackStorage: '__clearStorage',
        }),
        ...mapActions('tab', {
            __clearTranslationsStorage: '__clearStorage',
        }),
        bindingProps({
            props = {},
        }) {
            return {
                privileges: PRIVILEGES.CATEGORY_TREE,
                ...props,
            };
        },
    },
    head() {
        return {
            title: `${this.code} - Category trees - Ergonode`,
        };
    },
};
</script>
