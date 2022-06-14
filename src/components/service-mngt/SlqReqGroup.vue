<template>
  <li>
    <label class="label point">{{ inputNm }} :</label>
    <div class="form-cont">
      <div class="sla-toggle">
        <button
          class="btn-toggle"
          :class="{
            on: showSec,
            '': !showSec,
          }"
          @click="clickSec()"
        >
          Sec
        </button>
        <button
          class="btn-toggle"
          :class="{
            on: showMin,
            '': !showMin,
          }"
          @click="clickMin()"
        >
          Min
        </button>
        <button
          class="btn-toggle"
          :class="{
            on: showHr,
            '': !showHr,
          }"
          @click="clickHr()"
        >
          Hour
        </button>
        <button
          class="btn-toggle"
          :class="{
            on: showDay,
            '': !showDay,
          }"
          @click="clickDay()"
        >
          Day
        </button>
        <button
          class="btn-toggle"
          :class="{
            on: showMon,
            '': !showMon,
          }"
          @click="clickMon()"
        >
          Month
        </button>
        <button
          class="btn-toggle"
          :class="{
            on: none,
            '': !none,
          }"
          @click="clickNone()"
        >
          None
        </button>
      </div>

      <div class="sla-group">
        <div class="sla-form" v-if="showMon">
          <label class="label">Month : </label>
          <input type="number" id="" class="input-box" placeholder="입력해주세요" v-model="month" min="1" step="1" />
          <span>건</span>
        </div>
        <div class="sla-form" v-if="showDay">
          <label class="label">Day : </label>
          <input type="number" id="" class="input-box" placeholder="입력해주세요" v-model="day" min="1" step="1" />
          <span>건</span>
        </div>
        <div class="sla-form" v-if="showHr">
          <label class="label">Hour : </label>
          <input type="number" id="" class="input-box" placeholder="입력해주세요" v-model="hour" min="1" step="1" />
          <span>건</span>
        </div>
        <div class="sla-form" v-if="showMin">
          <label class="label">Min : </label>
          <input type="number" id="" class="input-box" placeholder="입력해주세요" v-model="min" min="1" step="1" />
          <span>건</span>
        </div>
        <div class="sla-form" v-if="showSec">
          <label class="label">Sec : </label>
          <input type="number" id="" class="input-box" placeholder="입력해주세요" v-model="sec" min="1" step="1" />
          <span>건</span>
        </div>
      </div>
      <p
        v-if="
          (showSec && sec == null) ||
          (showMin && min == null) ||
          (showHr && hour == null) ||
          (showDay && day == null) ||
          (showMon && month == null)
        "
        class="red-txt noti"
      >
        {{ $t('service.empty_check') }}
      </p>
      <p
        v-else-if="
          (showSec && sec == '') ||
          (showMin && min == '') ||
          (showHr && hour == '') ||
          (showDay && day == '') ||
          (showMon && month == '')
        "
        class="red-txt noti"
      >
        {{ $t('service.empty_check') }}
      </p>
      <p
        v-else-if="
          (showSec && sec == 0) ||
          (showMin && min == 0) ||
          (showHr && hour == 0) ||
          (showDay && day == 0) ||
          (showMon && month == 0)
        "
        class="red-txt noti"
      >
        1 이상의 값을 입력해주세요.
      </p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
const props = defineProps<{
  inputNm: string;
  secVal: Number | null;
  minVal: Number | null;
  hourVal: Number | null;
  dayVal: Number | null;
  monthVal: Number | null;
  onSec: Boolean;
  onMin: Boolean;
  onHr: Boolean;
  onDay: Boolean;
  onMon: Boolean;
}>();

const emit = defineEmits<{
  (e: 'update:onSec', value: boolean): void;
  (e: 'update:onMin', value: boolean): void;
  (e: 'update:onHr', value: boolean): void;
  (e: 'update:onDay', value: boolean): void;
  (e: 'update:onMon', value: boolean): void;
  (e: 'update:secVal', value: number | null): void;
  (e: 'update:minVal', value: number | null): void;
  (e: 'update:hourVal', value: number | null): void;
  (e: 'update:dayVal', value: number | null): void;
  (e: 'update:monthVal', value: number | null): void;
}>();

const none = ref(false);
const showSec = ref(false);
const showMin = ref(false);
const showHr = ref(false);
const showDay = ref(false);
const showMon = ref(false);

watch(showSec, (val) => {
  emit('update:onSec', val);
});
watch(showMin, (val) => {
  emit('update:onMin', val);
});
watch(showHr, (val) => {
  emit('update:onHr', val);
});
watch(showDay, (val) => {
  emit('update:onDay', val);
});
watch(showMon, (val) => {
  emit('update:onMon', val);
});

const sec: Ref<number | string | null> = computed({
  get: () => {
    if (props.secVal != null) {
      showSec.value = true;
    }
    return props.secVal as number | null;
  },
  set: (val: number | string | null) => {
    if (val == '') {
      emit('update:secVal', null);
    } else if (typeof val !== 'string') {
      emit('update:secVal', val);
    }
  },
});

const min: Ref<number | string | null> = computed({
  get: () => {
    if (props.minVal != null) {
      showMin.value = true;
    }
    return props.minVal as number | null;
  },
  set: (val: number | string | null) => {
    if (val == '') {
      emit('update:minVal', null);
    } else if (typeof val !== 'string') {
      emit('update:minVal', val);
    }
  },
});

const hour: Ref<number | string | null> = computed({
  get: () => {
    if (props.hourVal != null) {
      showHr.value = true;
    }
    return props.hourVal as number | null;
  },
  set: (val: number | string | null) => {
    if (val == '') {
      emit('update:hourVal', null);
    } else if (typeof val !== 'string') {
      emit('update:hourVal', val);
    }
  },
});

const day: Ref<number | string | null> = computed({
  get: () => {
    if (props.dayVal != null) {
      showDay.value = true;
    }
    return props.dayVal as number | null;
  },
  set: (val: number | string | null) => {
    if (val == '') {
      emit('update:dayVal', null);
    } else if (typeof val !== 'string') {
      emit('update:dayVal', val);
    }
  },
});

const month: Ref<number | string | null> = computed({
  get: () => {
    if (props.monthVal != null) {
      showMon.value = true;
    }
    return props.monthVal as number | null;
  },
  set: (val: number | string | null) => {
    if (val == '') {
      emit('update:monthVal', null);
    } else if (typeof val !== 'string') {
      emit('update:monthVal', val);
    }
  },
});

onMounted(() => {
  if (sec.value != null) {
    showSec.value = true;
  }
  if (min.value != null) {
    showMin.value = true;
  }
  if (hour.value != null) {
    showHr.value = true;
  }
  if (day.value != null) {
    showDay.value = true;
  }
  if (month.value != null) {
    showMon.value = true;
  }
  if (
    props.monthVal == null &&
    props.dayVal == null &&
    props.hourVal == null &&
    props.minVal == null &&
    props.secVal == null
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
});

const clickSec = () => {
  showSec.value = !showSec.value;
  sec.value = null;
  if (
    showMon.value == false &&
    showDay.value == false &&
    showHr.value == false &&
    showMin.value == false &&
    showSec.value == false
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
};

const clickMin = () => {
  showMin.value = !showMin.value;
  min.value = null;
  if (
    showMon.value == false &&
    showDay.value == false &&
    showHr.value == false &&
    showMin.value == false &&
    showSec.value == false
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
};

const clickHr = () => {
  showHr.value = !showHr.value;
  hour.value = null;
  if (
    showMon.value == false &&
    showDay.value == false &&
    showHr.value == false &&
    showMin.value == false &&
    showSec.value == false
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
};

const clickDay = () => {
  showDay.value = !showDay.value;
  day.value = null;
  if (
    showMon.value == false &&
    showDay.value == false &&
    showHr.value == false &&
    showMin.value == false &&
    showSec.value == false
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
};

const clickMon = () => {
  showMon.value = !showMon.value;
  month.value = null;
  if (
    showMon.value == false &&
    showDay.value == false &&
    showHr.value == false &&
    showMin.value == false &&
    showSec.value == false
  ) {
    none.value = true;
  } else {
    none.value = false;
  }
};

const clickNone = () => {
  none.value = !none.value;
  if (none.value) {
    showSec.value = false;
    showMin.value = false;
    showHr.value = false;
    showDay.value = false;
    showMon.value = false;
    sec.value = null;
    min.value = null;
    hour.value = null;
    day.value = null;
    month.value = null;
  }
};
</script>
