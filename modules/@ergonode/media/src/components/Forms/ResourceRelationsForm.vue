/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Form
        :title="$t('media.form.productRelationsTitle')"
        v-if="isPrefetchingData || (!isPrefetchingData && rows.length)">
        <template #body>
            <FormSection>
                <Table :is-prefetching-data="isPrefetchingData">
                    <template #body>
                        <TableRow
                            v-for="row in rows"
                            :key="row.name">
                            <TableRowHeader :title="row.name" />
                            <TableRowCell>
                                <LinkRelationButton
                                    v-for="relation in row.relations"
                                    :key="relation.name"
                                    :title="relation.name"
                                    :link="relation._link"
                                    :namespace="row.type" />
                            </TableRowCell>
                        </TableRow>
                        <template
                            v-for="(item, index) in extendedTable">
                            <Component
                                :is="item.component"
                                :key="index"
                                v-bind="bindingProps(item)" />
                        </template>
                    </template>
                </Table>
            </FormSection>
        </template>
    </Form>
    <TabBarNoDataPlaceholder
        v-else
        :title="$t('media.tab.productRelationsPlaceholderTitle')"
        :subtitle="$t('media.tab.productRelationsPlaceholderSubtitle')" />
</template>

<script>
import LinkRelationButton from '@Media/components/Buttons/LinkRelationButton';
import PRIVILEGES from '@Media/config/privileges';
import Form from '@UI/components/Form/Form';
import FormSection from '@UI/components/Form/Section/FormSection';
import TabBarNoDataPlaceholder from '@UI/components/TabBar/TabBarNoDataPlaceholder';
import Table from '@UI/components/Table/Table';
import TableRow from '@UI/components/Table/TableRow';
import TableRowCell from '@UI/components/Table/TableRowCell';
import TableRowHeader from '@UI/components/Table/TableRowHeader';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'ResourceRelationsForm',
    components: {
        Form,
        FormSection,
        LinkRelationButton,
        TabBarNoDataPlaceholder,
        Table,
        TableRow,
        TableRowHeader,
        TableRowCell,
    },
    data() {
        return {
            rows: [],
            isPrefetchingData: true,
        };
    },
    computed: {
        extendedTable() {
            return this.$getExtendSlot('@Media/components/Forms/ResourceRelationsForm/tableBody');
        },
    },
    async created() {
        await this.getResourceRelation({
            onSuccess: (({
                rows,
            }) => {
                this.rows = rows;
                this.isPrefetchingData = false;
            }),
        });
    },
    methods: {
        ...mapActions('media', [
            'getResourceRelation',
        ]),
        bindingProps({
            props = {},
        }) {
            return {
                privileges: PRIVILEGES.MULTIMEDIA,
                ...props,
            };
        },
    },
};
</script>
