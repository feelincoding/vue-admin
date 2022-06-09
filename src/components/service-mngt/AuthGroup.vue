<template>
  <li>
    <label class="label">{{ inputNm }}</label>
    <div v-if="athn == 'basic'" class="form-cont">
      <p class="bold">{{ athn }}</p>
      <div class="sub-group">
        <ul>
          <li>
            <label class="label">ID :</label>
            <span class="text">{{ id }}</span>
          </li>
          <li>
            <label class="label">PW :</label>
            <span class="text">{{ pw }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="athn == 'jwt'" class="form-cont">
      <p class="bold">{{ athn }}</p>
      <div class="sub-group">
        <ul>
          <li>
            <label class="label">알고리즘 :</label>
            <span class="text">{{ alg }}</span>
          </li>
          <li>
            <label class="label">발급자 :</label>
            <span class="text">{{ iss }}</span>
          </li>
          <li>
            <label class="label">대상자 :</label>
            <span class="text">{{ aud }}</span>
          </li>
          <li>
            <label class="label">공개key :</label>
            <span class="text">{{ pubKey }}</span>
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class AuthGroup extends Vue {
  @Prop() inputNm!: string;
  @Prop() athn!: string;
  @Prop() id!: string | null;
  @Prop() pw!: string | null;
  @Prop() alg!: string | null;
  @Prop() iss!: string | null;
  @Prop() aud!: string | null;
  @Prop() pubKey!: string | null;
}
</script>
