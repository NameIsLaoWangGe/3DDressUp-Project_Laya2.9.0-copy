export namespace GO
{
    export function Instantiate(node: Laya.Node): Laya.Node
    {
        let comp = Node2Comp(node);
        // console.log(JSON.stringify(comp));
        let gobj = Laya.SceneUtils.createComp(comp);
        return gobj;
    }

    function Node2Comp(node: Laya.Node)
    {
        let comp: any = {};
        comp.type = node.constructor.name;
        comp.props = {};
        if (node.name != null) comp.props.name = node.name;
        if (node instanceof Laya.Sprite) Props_Sprite(node, comp.props);
        if (node instanceof Laya.Scene) Props_Scene(node, comp.props);
        if (node instanceof Laya.UIComponent) Props_UIComponent(node, comp.props);
        if (node instanceof Laya.Text) 
        {
            if (node.parent instanceof Laya.Label && node.parent.textField == node)
            {
                return null;
            }
            Props_Text(node, comp.props);
        }
        if (node instanceof Laya.Dialog) Props_Dialog(node, comp.props);
        if (node instanceof Laya.Clip) Props_Clip(node, comp.props);
        if (node instanceof Laya.FontClip) Props_FontClip(node, comp.props);
        if (node instanceof Laya.Image) Props_Image(node, comp.props);
        if (node instanceof Laya.Button) Props_Button(node, comp.props);
        if (node instanceof Laya.ComboBox) Props_ComboBox(node, comp.props);
        if (node instanceof Laya.Slider) Props_Slider(node, comp.props);
        if (node instanceof Laya.ScrollBar) Props_ScrollBar(node, comp.props);
        if (node instanceof Laya.ProgressBar) Props_ProgressBar(node, comp.props);
        if (node instanceof Laya.Label) Props_Label(node, comp.props);
        if (node instanceof Laya.TextInput) Props_TextInput(node, comp.props);
        if (node instanceof Laya.TextArea) Props_TextArea(node, comp.props);
        if (node instanceof Laya.ColorPicker) Props_ColorPicker(node, comp.props);
        if (node instanceof Laya.Box) Props_Box(node, comp.props);
        if (node instanceof Laya.LayoutBox) Props_LayoutBox(node, comp.props);
        if (node instanceof Laya.Panel) Props_Panel(node, comp.props);
        if (node instanceof Laya.List) Props_List(node, comp.props);
        if (node instanceof Laya.Tree) Props_Tree(node, comp.props);
        if (node instanceof Laya.ViewStack) Props_ViewStack(node, comp.props);
        if (node instanceof Laya.UIGroup) Props_UIGroup(node, comp.props);
        if (node instanceof Laya.Tab) Props_Tab(node, comp.props);
        comp.child = [];
        for (let i = 0; i < node.numChildren; i++)
        {
            let cc = Node2Comp(node.getChildAt(i));
            if (cc != null)
            {
                comp.child.push(cc);
            }
        }
        if (node instanceof Laya.Sprite) Child_Mask(node, comp.child);
        Child_Script(node, comp.child);
        return comp;
    }

    function Child_Script(node: Laya.Node, child: any[])
    {
        let cs = node.getComponents(Laya.Script);
        if (cs != null)
        {
            for (let c of cs)
            {
                child.push({ type: "Script", props: { runtime: c.runtime } });
            }
        }
    }
    function Child_Mask(node: Laya.Sprite, child: any[])
    {
        if (node.mask != null)
        {
            child.push(Node2Comp(node.mask));
        }
    }

    function Props_Sprite(node: Laya.Sprite, props: any)
    {
        if (!isNaN(node.x)) props.x = node.x;
        if (!isNaN(node.y)) props.y = node.y;
        if (!isNaN(node.width)) props.width = node.width;
        if (!isNaN(node.height)) props.height = node.height;
        if (node.visible != null) props.visible = node.visible;
        if (node.texture != null) props.texture = node.texture.url;
        // if (node.mouseEnabled != null) props.mouseEnabled = node.mouseEnabled;
        if (node["renderType"] != null) props.renderType = node["renderType"];
    }

    function Props_Scene(node: Laya.Scene, props: any)
    {
        if (node.autoDestroyAtClosed != null) props.autoDestroyAtClosed = node.autoDestroyAtClosed;
    }
    function Props_UIComponent(node: Laya.UIComponent, props: any)
    {
        if (!isNaN(node.anchorX)) props.anchorX = node.anchorX;
        if (!isNaN(node.anchorY)) props.anchorY = node.anchorY;
        if (!isNaN(node.centerX)) props.centerX = node.centerX;
        if (!isNaN(node.centerY)) props.centerY = node.centerY;
        if (!isNaN(node.top)) props.top = node.top;
        if (!isNaN(node.bottom)) props.bottom = node.bottom;
        if (!isNaN(node.left)) props.left = node.left;
        if (!isNaN(node.right)) props.right = node.right;
    }
    function Props_Text(node: Laya.Text, props: any)
    {
        if (node.text != null) props.text = node.text;
        if (node["runtime"] != null) props.runtime = node["runtime"];
    }

    function Props_Dialog(node: Laya.Dialog, props: any)
    {
        if (node.group != null) props.group = node.group;
        if (node.dragArea != null) props.dragArea = node.dragArea;
        if (node.isShowEffect != null) props.isShowEffect = node.isShowEffect;
        if (node.isPopupCenter != null) props.isPopupCenter = node.isPopupCenter;
        if (node.isModal != null) props.isModal = node.isModal;
    }

    function Props_Clip(node: Laya.Clip, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.group != null) props.group = node.group;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.autoPlay != null) props.autoPlay = node.autoPlay;
        if (!isNaN(node.index)) props.index = node.index;
        if (!isNaN(node.clipX)) props.clipX = node.clipX;
        if (!isNaN(node.clipY)) props.clipY = node.clipY;
        if (!isNaN(node.clipWidth)) props.clipWidth = node.clipWidth;
        if (!isNaN(node.clipHeight)) props.clipHeight = node.clipHeight;
    }
    function Props_FontClip(node: Laya.FontClip, props: any)
    {
        if (node.value != null) props.value = node.value;
        if (node.sheet != null) props.sheet = node.sheet;
        if (node.align != null) props.align = node.align;
        if (node.direction != null) props.direction = node.direction;
        if (!isNaN(node.spaceX)) props.spaceX = node.spaceX;
        if (!isNaN(node.spaceY)) props.spaceY = node.spaceY;
    }
    function Props_Image(node: Laya.Image, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.group != null) props.group = node.group;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
    }
    function Props_Button(node: Laya.Button, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.label != null) props.label = node.label;
        if (node.toggle != null) props.toggle = node.toggle;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.selected != null) props.selected = node.selected;
        if (node.strokeColors != null) props.strokeColors = node.strokeColors;
        if (node.labelStrokeColor != null) props.labelStrokeColor = node.labelStrokeColor;
        if (node.labelPadding != null) props.labelPadding = node.labelPadding;
        if (node.labelFont != null) props.labelFont = node.labelFont;
        if (node.labelColors != null) props.labelColors = node.labelColors;
        if (node.labelBold != null) props.labelBold = node.labelBold;
        if (node.labelAlign != null) props.labelAlign = node.labelAlign;
        if (!isNaN(node.stateNum)) props.stateNum = node.stateNum;
        if (!isNaN(node.labelSize)) props.labelSize = node.labelSize;
        if (!isNaN(node.labelStroke)) props.labelStroke = node.labelStroke;
    }
    function Props_ComboBox(node: Laya.ComboBox, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.selectedLabel != null) props.selectedLabel = node.selectedLabel;
        if (node.scrollBarSkin != null) props.scrollBarSkin = node.scrollBarSkin;
        if (node.labels != null) props.labels = node.labels;
        if (node.labelFont != null) props.labelFont = node.labelFont;
        if (node.labelBold != null) props.labelBold = node.labelBold;
        if (node.labelColors != null) props.labelColors = node.labelColors;
        if (node.labelPadding != null) props.labelPadding = node.labelPadding;
        if (node.itemColors != null) props.itemColors = node.itemColors;
        if (!isNaN(node.itemSize)) props.itemSize = node.itemSize;
        if (!isNaN(node.labelSize)) props.labelSize = node.labelSize;
        if (!isNaN(node.stateNum)) props.stateNum = node.stateNum;
        if (!isNaN(node.visibleNum)) props.visibleNum = node.visibleNum;
        if (!isNaN(node.selectedIndex)) props.selectedIndex = node.selectedIndex;
    }
    function Props_Slider(node: Laya.Slider, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.showLabel != null) props.showLabel = node.showLabel;
        if (node.allowClickBack != null) props.allowClickBack = node.allowClickBack;
        if (!isNaN(node.value)) props.value = node.value;
        if (!isNaN(node.tick)) props.tick = node.tick;
        if (!isNaN(node.min)) props.min = node.min;
        if (!isNaN(node.max)) props.max = node.max;
    }
    function Props_ScrollBar(node: Laya.ScrollBar, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.hide != null) props.hide = node.hide;
        if (node.autoHide != null) props.autoHide = node.autoHide;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.showButtons != null) props.showButtons = node.showButtons;
        if (node.mouseWheelEnable != null) props.mouseWheelEnable = node.mouseWheelEnable;
        if (node.touchScrollEnable != null) props.touchScrollEnable = node.touchScrollEnable;
        if (!isNaN(node.value)) props.value = node.value;
        if (!isNaN(node.min)) props.min = node.min;
        if (!isNaN(node.max)) props.max = node.max;
        if (!isNaN(node.rollRatio)) props.rollRatio = node.rollRatio;
        if (!isNaN(node.scrollSize)) props.scrollSize = node.scrollSize;
        if (!isNaN(node.elasticDistance)) props.elasticDistance = node.elasticDistance;
        if (!isNaN(node.elasticBackTime)) props.elasticBackTime = node.elasticBackTime;
    }
    function Props_ProgressBar(node: Laya.ProgressBar, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (!isNaN(node.value)) props.value = node.value;
    }

    function Props_Label(node: Laya.Label, props: any)
    {
        if (node.text != null) props.text = node.text;
        if (node.font != null) props.font = node.font;
        if (node.color != null) props.color = node.color;
        if (node.align != null) props.align = node.align;
        if (node.valign != null) props.valign = node.valign;
        if (node.wordWrap != null) props.wordWrap = node.wordWrap;
        if (node.underline != null) props.underline = node.underline;
        if (node.underlineColor != null) props.underlineColor = node.underlineColor;
        if (node.padding != null) props.padding = node.padding;
        if (node.overflow != null) props.overflow = node.overflow;
        if (node.italic != null) props.italic = node.italic;
        if (node.strokeColor != null) props.strokeColor = node.strokeColor;
        if (node.borderColor != null) props.borderColor = node.borderColor;
        if (node.bold != null) props.bold = node.bold;
        if (node.bgColor != null) props.bgColor = node.bgColor;
        if (!isNaN(node.leading)) props.leading = node.leading;
        if (!isNaN(node.fontSize)) props.fontSize = node.fontSize;
        if (!isNaN(node.stroke)) props.stroke = node.stroke;
    }
    function Props_TextInput(node: Laya.TextInput, props: any)
    {
        if (node.text != null) props.text = node.text;
        if (node.skin != null) props.skin = node.skin;
        if (node.type != null) props.type = node.type;
        if (node.sizeGrid != null) props.sizeGrid = node.sizeGrid;
        if (node.restrict != null) props.restrict = node.restrict;
        if (node.prompt != null) props.prompt = node.prompt;
        if (node.promptColor != null) props.promptColor = node.promptColor;
        if (node.multiline != null) props.multiline = node.multiline;
        if (node.editable != null) props.editable = node.editable;
        if (!isNaN(node.maxChars)) props.maxChars = node.maxChars;
    }
    function Props_TextArea(node: Laya.TextArea, props: any)
    {
        if (node.vScrollBarSkin != null) props.vScrollBarSkin = node.vScrollBarSkin;
        if (node.hScrollBarSkin != null) props.hScrollBarSkin = node.hScrollBarSkin;
    }
    function Props_ColorPicker(node: Laya.ColorPicker, props: any)
    {
        if (node.selectedColor != null) props.selectedColor = node.selectedColor;
        if (node.inputColor != null) props.inputColor = node.inputColor;
        if (node.inputBgColor != null) props.inputBgColor = node.inputBgColor;
        if (node.borderColor != null) props.borderColor = node.borderColor;
        if (node.bgColor != null) props.bgColor = node.bgColor;
    }

    function Props_Box(node: Laya.Box, props: any)
    {
        if (node.bgColor != null) props.bgColor = node.bgColor;
    }
    function Props_LayoutBox(node: Laya.LayoutBox, props: any)
    {
        if (node.align != null) props.align = node.align;
        if (!isNaN(node.space)) props.space = node.space;
    }
    function Props_Panel(node: Laya.Panel, props: any)
    {
        if (node.elasticEnabled != null) props.elasticEnabled = node.elasticEnabled;
        if (node.hScrollBarSkin != null) props.hScrollBarSkin = node.hScrollBarSkin;
        if (node.vScrollBarSkin != null) props.vScrollBarSkin = node.vScrollBarSkin;
    }
    function Props_List(node: Laya.List, props: any)
    {
        if (!isNaN(node.width)) props.width = node.width;
        if (!isNaN(node.height)) props.height = node.height;
        if (!isNaN(node.spaceX)) props.spaceX = node.spaceX;
        if (!isNaN(node.spaceY)) props.spaceY = node.spaceY;
        if (!isNaN(node.repeatX)) props.repeatX = node.repeatX;
        if (!isNaN(node.repeatY)) props.repeatY = node.repeatY;
        if (!isNaN(node.selectedIndex)) props.selectedIndex = node.selectedIndex;
        if (node.selectEnable != null) props.selectEnable = node.selectEnable;
        if (node.elasticEnabled != null) props.elasticEnabled = node.elasticEnabled;
        if (node.hScrollBarSkin != null) props.hScrollBarSkin = node.hScrollBarSkin;
        if (node.vScrollBarSkin != null) props.vScrollBarSkin = node.vScrollBarSkin;
    }
    function Props_Tree(node: Laya.Tree, props: any)
    {
        if (!isNaN(node.width)) props.width = node.width;
        if (!isNaN(node.height)) props.height = node.height;
        if (!isNaN(node.spaceLeft)) props.spaceLeft = node.spaceLeft;
        if (!isNaN(node.spaceBottom)) props.spaceBottom = node.spaceBottom;
        if (!isNaN(node.selectedIndex)) props.selectedIndex = node.selectedIndex;
        if (node.scrollBarSkin != null) props.scrollBarSkin = node.scrollBarSkin;
        if (node.keepStatus != null) props.keepStatus = node.keepStatus;
    }
    function Props_ViewStack(node: Laya.ViewStack, props: any)
    {
        if (!isNaN(node.selectedIndex)) props.selectedIndex = node.selectedIndex;
    }
    function Props_UIGroup(node: Laya.UIGroup, props: any)
    {
        if (node.skin != null) props.skin = node.skin;
        if (node.labels != null) props.labels = node.labels;
        if (node.labelStrokeColor != null) props.labelStrokeColor = node.labelStrokeColor;
        if (node.labelPadding != null) props.labelPadding = node.labelPadding;
        if (node.labelFont != null) props.labelFont = node.labelFont;
        if (node.labelColors != null) props.labelColors = node.labelColors;
        if (node.labelBold != null) props.labelBold = node.labelBold;
        if (node.strokeColors != null) props.strokeColors = node.strokeColors;
        if (node.direction != null) props.direction = node.direction;
        if (!isNaN(node.space)) props.space = node.space;
        if (!isNaN(node.stateNum)) props.stateNum = node.stateNum;
        if (!isNaN(node.selectedIndex)) props.selectedIndex = node.selectedIndex;
        if (!isNaN(node.labelStroke)) props.labelStroke = node.labelStroke;
        if (!isNaN(node.labelSize)) props.labelSize = node.labelSize;
    }
    function Props_Tab(node: Laya.Tab, props: any)
    {
        if (node["labelAlign"] != null) props.labelAlign = node["labelAlign"];
    }
}