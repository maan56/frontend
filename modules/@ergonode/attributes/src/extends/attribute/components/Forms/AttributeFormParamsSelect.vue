/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Select
        :data-cy="dataCyGenerator('params')"
        key="attrHasParams"
        :value="value"
        required
        :label="paramsLabel"
        :options="attributeParametersOptions"
        :error-messages="errorMessage"
        :disabled="!isAllowedToUpdate"
        @input="setParameterValue" />
</template>

<script>
import PRIVILEGES from '@Attributes/config/privileges';
import {
    toCapitalize,
} from '@Core/models/stringWrapper';
import Select from '@UI/components/Select/Select';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'AttributeFormParamsSelect',
    components: {
        Select,
    },
    props: {
        errors: {
            type: Object,
            default: () => ({}),
        },
        typeKey: {
            type: String,
            default: '',
        },
        getParams: {
            type: Function,
            default: () => ({}),
        },
    },
    data() {
        return {
            parameterData: {},
        };
    },
    computed: {
        isAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.ATTRIBUTE.update,
            ]);
        },
        value() {
            return this.$store.state.attribute[this.parameterData.fieldName];
        },
        paramsLabel() {
            return toCapitalize(this.parameterData.translation);
        },
        params() {
            return this.parameterData.value;
        },
        attributeParametersOptions() {
            // TODO:(DICTIONARY_TYPE) remove condition when dictionary data consistency
            if (Array.isArray(this.params)) {
                return this.params.map(data => data.name);
            }
            return Object.values(this.params);
        },
        paramsFieldKey() {
            return 'parameters';
        },
        errorMessage() {
            const error = this.errors[this.paramsFieldKey];

            return error ? error[this.parameterData.key] : null;
        },
    },
    watch: {
        typeKey: {
            handler() {
                this.setParameterValue();
            },
        },
    },
    created() {
        this.parameterData = this.getParams(this).params;
    },
    beforeDestroy() {
        this.setParameterValue();
    },
    methods: {
        ...mapActions('attribute', [
            '__setState',
        ]),
        setParameterValue(value = null) {
            this.__setState({
                key: this.parameterData.fieldName,
                value,
            });
        },
        dataCyGenerator(key) {
            return `attribute-${key}`;
        },
    },
};
</script>
