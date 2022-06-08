<!-- <template>
  <div>
    <label class="label">{{ label }}</label>
    <select class="select-box" @change="handleChangeTarget">
      <option v-for="(item, index) in selectOptions" :key="index" :selected="item.label == searchTarget">
        {{ item.value }}
      </option>
    </select>
    <input type="text" class="input-box" :value="searchValue" @change="handleChangeSearchData" @keyup="handleKeyup" />
  </div>
</template>

<script lang="ts">
import { SelectOptionType } from '@/types/SearchType';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SelectBox extends Vue {
  @Prop() public label!: string;
  @Prop() public placeholder!: string;
  @Prop() public selectOptions!: SelectOptionType[];
  @Prop() public searchTarget!: string;
  @Prop() public searchValue!: string;

  handleKeyup(event: any) {
    if (event.keyCode === 13) {
      this.$emit('submit');
    }
  }
  handleChangeTarget(event: any) {
    this.$emit('update:searchTarget', this.selectOptions[event.target.selectedIndex].label);
  }
  handleChangeSearchData(event: any) {
    this.$emit('update:searchValue', event.target.value);
  }
}
</script> -->
