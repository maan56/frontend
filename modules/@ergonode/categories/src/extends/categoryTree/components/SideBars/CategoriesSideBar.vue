/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <SideBar
        :title="$t('category.sideBar.searchHeader')"
        :items="categoriesByLanguage"
        :searchable="true"
        :search-value="searchValue"
        @search="onSearch">
        <template #body>
            <Preloader v-if="isPrefetchingData" />
        </template>
        <template #noDataPlaceholder>
            <SideBarNoDataPlaceholder
                :title="$t('category.sideBar.placeholderTitle')"
                :subtitle="$t('category.sideBar.placeholderSubtitle')">
                <template #action>
                    <CreateCategoryButton />
                </template>
            </SideBarNoDataPlaceholder>
        </template>
        <template #item="{ item }">
            <CategorySideBarElement
                :item="item"
                :language-code="languageCode"
                :disabled="disabled" />
        </template>
    </SideBar>
</template>

<script>
import CreateCategoryButton from '@Categories/components/Buttons/CreateCategoryButton';
import {
    CATEGORY_CREATED_EVENT_NAME,
} from '@Categories/defaults/attributes';
import CategorySideBarElement from '@Categories/extends/categoryTree/components/SideBars/CategorySideBarElement';
import {
    deepClone,
} from '@Core/models/objectWrapper';
import {
    getItems,
} from '@Core/services/sidebar';
import Preloader from '@UI/components/Preloader/Preloader';
import SideBar from '@UI/components/SideBar/SideBar';
import SideBarNoDataPlaceholder from '@UI/components/SideBar/SideBarNoDataPlaceholder';
import debounce from 'debounce';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'CategoriesSideBar',
    components: {
        Preloader,
        SideBarNoDataPlaceholder,
        CreateCategoryButton,
        CategorySideBarElement,
        SideBar,
    },
    props: {
        isSelectLanguage: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    async fetch() {
        await this.getItems();

        this.isPrefetchingData = false;
    },
    data() {
        return {
            isPrefetchingData: true,
            categories: {},
            categoriesBeforeSearch: {},
            languageCode: '',
            searchValue: '',
            onDebounceGetItems: null,
        };
    },
    computed: {
        ...mapState('core', [
            'defaultLanguageCode',
        ]),
        categoriesByLanguage() {
            return this.categories[this.languageCode] || [];
        },
    },
    created() {
        this.languageCode = this.defaultLanguageCode;

        this.onDebounceGetItems = debounce(this.getItems, 500);
    },
    mounted() {
        document.documentElement.addEventListener(
            CATEGORY_CREATED_EVENT_NAME,
            this.onCategoryCreated,
        );
    },
    beforeDestroy() {
        this.setDisabledElements({});

        document.documentElement.removeEventListener(
            CATEGORY_CREATED_EVENT_NAME,
            this.onCategoryCreated,
        );
    },
    methods: {
        ...mapActions('list', [
            'setDisabledElements',
        ]),
        async onCategoryCreated() {
            await this.getItems();
        },
        async getItems() {
            const params = {
                limit: 99999,
                offset: 0,
                view: 'list',
                field: 'code',
                order: 'ASC',
            };

            if (this.searchValue !== '') {
                params.filter = `code=${this.searchValue}`;
            }

            await getItems({
                $axios: this.$axios,
                languageCode: this.languageCode,
                path: `${this.languageCode}/categories`,
                params,
                onSuccess: this.getItemsSuccess,
            });
        },
        getItemsSuccess({
            items,
            languageCode,
        }) {
            this.categories = {
                ...this.categories,
                [languageCode]: items,
            };
        },
        async onSearch(value) {
            if (this.searchValue === '') {
                this.categoriesBeforeSearch = deepClone(this.categories);
            }

            this.searchValue = value;

            if (value !== '') {
                this.onDebounceGetItems();
            } else {
                this.categories = deepClone(this.categoriesBeforeSearch);
                this.categoriesBeforeSearch = {};
            }
        },
    },
};
</script>
