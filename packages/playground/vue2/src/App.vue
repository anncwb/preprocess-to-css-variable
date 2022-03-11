<template>
  <div class="main">
    <h2>ant-design-vue 1.x</h2>
    <div class="content">
      <div class="comp">
        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">Dashed Button</a-button>
        <a-button type="text">Text Button</a-button>
        <a-button type="link">Link Button</a-button>
        <a-input />
        <a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            Hover me <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <a-menu v-model="current" mode="horizontal">
          <a-menu-item key="mail">
            <a-icon type="mail" />Navigation One
          </a-menu-item>
          <a-menu-item key="app" disabled>
            <a-icon type="appstore" />Navigation Two
          </a-menu-item>
          <a-sub-menu>
            <span slot="title" class="submenu-title-wrapper"
              ><a-icon type="setting" />Navigation Three - Submenu</span
            >
            <a-menu-item-group title="Item 1">
              <a-menu-item key="setting:1"> Option 1 </a-menu-item>
              <a-menu-item key="setting:2"> Option 2 </a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group title="Item 2">
              <a-menu-item key="setting:3"> Option 3 </a-menu-item>
              <a-menu-item key="setting:4"> Option 4 </a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-menu-item key="alipay">
            <a
              href="https://antdv.com"
              target="_blank"
              rel="noopener noreferrer"
              >Navigation Four - Link</a
            >
          </a-menu-item>
        </a-menu>

        <a-pagination show-size-changer :default-current="3" :total="500" />

        <a-steps :current="1" size="small">
          <a-step title="Finished" />
          <a-step title="In Progress" />
          <a-step title="Waiting" />
        </a-steps>

        <a-checkbox> Checkbox </a-checkbox>

        <div>
          <a-date-picker />
          <br />
          <a-month-picker placeholder="Select month" />
          <br />
          <a-range-picker />
          <br />
          <a-week-picker placeholder="Select week" />
        </div>

        <a-button type="primary" @click="showModal"> Open Modal </a-button>
        <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </a-modal>
      </div>
      <div class="color-picker">
        <div
          @click="selectColor"
          class="select-button"
          :style="{ background: color }"
        >
          点击选择颜色
        </div>
        <input ref="input" type="color" @input="inputChange" class="input" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { generate } from 'preprocess-to-css-variable/es/index';

export default {
  data() {
    return {
      color: '',
      visible: false,
      current: ['mail'],
    };
  },
  mounted() {},
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    selectColor() {
      this.$refs.input.click();
    },
    inputChange(v) {
      this.color = v.target.value;
      generate({ color: { primary: this.color } });
    },
  },
};
</script>
<style lang="less">
.main {
  padding: 20px;
  position: relative;

  h2 {
    width: 100%;
    text-align: center;
  }
  .content {
    display: flex;
  }

  .comp {
    width: 80%;
    & > * {
      margin: 10px 0;
    }
  }
  .color-picker {
    .input {
      visibility: hidden;
    }
  }
  .select-button {
    background: #1890ff;
    padding: 8px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
