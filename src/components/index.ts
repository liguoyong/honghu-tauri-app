
import SvgIcon from './SvgIcon/index.vue';
import ComForm from './form/Form.vue'
import ComPageHeader from './PageHeader/index.vue'
import ComDialog from './Dialog/index.vue'
import ComTable from './Table/Table.vue'
import DataEmpty from './DataEmpty/index.vue'
import ComPagination from './Pagination/index.vue'
import QuillEditor from './QuillEditor/index.vue'
import TipsTooltip from './TipsTooltip/index.vue'
import type { App, Component } from 'vue';
const components: { [name: string]: Component } = { 
    SvgIcon, 
    'com-form': ComForm, 
    'com-page-header': ComPageHeader,
    'com-table': ComTable,
    'com-pagination': ComPagination,
    'com-dialog': ComDialog,
    'data-empty': DataEmpty,
    'com-quill-editor': QuillEditor,
    'com-tooltip': TipsTooltip
};
export default {
    install(app: App) {
        Object.keys(components).forEach((key: string) => {
            app.component(key, components[key]);
        })
    }
}