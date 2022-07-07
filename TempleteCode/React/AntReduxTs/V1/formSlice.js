const commonConst = require( "../../../../Common/const.js");
const util = require( "../../../../Common/util.js");
const fieldTypeEnum = commonConst.fieldTypeEnum
const getAllFields = (formSettingData) => {
    const allFields = []
    formSettingData.cards.forEach(card => {
        card.rows.forEach(row => {
            row.fields.forEach(field => {
                allFields.push(field)
            })
        })
    })

    return allFields
}

const getDataType = (fieldType) => {
    let dataType = ''
    switch (fieldType) {
        case fieldTypeEnum.inputText:
        case fieldTypeEnum.select:
        case fieldTypeEnum.datePicker:
        case fieldTypeEnum.textarea:
            dataType = 'string'
            break;    
        case fieldTypeEnum.number:
            dataType = 'number'
            break;   
        default:
            dataType = null
    }

    return dataType
}

const getDependCode = (allFields) => {
    let interfaceDefinition = ''
    let initialState = ''
    const interfaceDefinitionArr = []
    const initialStateArr = []
    if(allFields.length > 0){
        allFields.forEach(x => {
            interfaceDefinitionArr.push(`${x.fieldName}?: ${x.fieldDataType}`)
            if(x.fieldType === fieldTypeEnum.treeSelect){
                interfaceDefinitionArr.push(`${x.fieldName}TreeData?: OptionType[]`)
            }

            if(x.defaultValue){
                let defaultValue = x.fieldDataType === 'string' ? `'${x.defaultValue}'` : x.defaultValue
                initialStateArr.push(
                    `${x.fieldName}: ${defaultValue}`
                )
            }
        })
        
        interfaceDefinition = interfaceDefinitionArr.join(';\n    ') + ';'
        initialState = initialStateArr.join(',\n    ')
    }
   

    return { interfaceDefinition, initialState }
}

const generateFormSlice = (formSettingData) => {
    formSettingData.moduleName = formSettingData.moduleName.charAt(0).toUpperCase() + formSettingData.moduleName.slice(1)
    const allFields = getAllFields(formSettingData)
    const dependCode = getDependCode(allFields)

    const code = `import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { OptionType } from '../../common/type';
export interface FieldChange {
    fieldName: string;
    fieldValue?: string | number | boolean | OptionType;
}

export interface ${formSettingData.moduleName} {
    ${dependCode.interfaceDefinition}
}

export interface ReduxData {
    ${formSettingData.moduleName}: ${formSettingData.moduleName};
}

const initialState: ReduxData = {
    FormEdit:{
        ${dependCode.initialState}
    }
};

export const ${formSettingData.moduleName}Slice = createSlice({
    name: '${formSettingData.moduleName}',
    initialState,
    reducers: {
        changeField: (state, action: PayloadAction<FieldChange>) => {
            (state.${formSettingData.moduleName} as any)[action.payload.fieldName] = action.payload.fieldValue
        },
    },
});

export const ${util.firstCharToLower(formSettingData.moduleName)} = (state: RootState) => state.${util.firstCharToLower(formSettingData.moduleName)};
export const { changeField } = ${formSettingData.moduleName}Slice.actions
export default ${formSettingData.moduleName}Slice.reducer;

`

    return code
}

module.exports = {generateFormSlice}