import { useItemsStore } from "@/store"
import { nextTick } from "vue";
import { infoMsg } from "@/hooks/Message/globalMessage";

const fn = {};
fn.default = () => {
    const itemsStore = useItemsStore();
    const { createDragItem } = itemsStore;
    const root = createDragItem(null)
    createDragItem(root)
    createDragItem(root)
    nextTick(() => root.standardizeChildrenPos())
    infoMsg('模板已应用')
}

function genWithTemplate(templateName) {
    fn[templateName]();
}
export {
    genWithTemplate
}