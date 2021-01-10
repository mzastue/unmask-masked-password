<template>
  <div :class="$style.wrapper">
    <div>
      <div :class="$style.row">{{ unmaskedPassword }}</div>

      <div :class="`${$style.row} ${$style.passwordLetters}`">
        <div
          :class="{ [$style.letterItem]: true, [$style.letterVisible]: shouldBeUnmasked(index + 1) }"
          v-for="(letter, index) in password.split('')"
          :key="`${index}`"
          @click="letterClickHandler(index + 1)"
        >
          <div :class="$style.letter">
            {{ shouldBeUnmasked(index + 1) ? letter : '' }}
          </div>
          <p>{{ index + 1 }}</p>
        </div>
      </div>

      <div :class="$style.row">
        <input type="password" name="password" placeholder="Type password here" v-model="password" />
      </div>

      <div :class="$style.row">
        <input type="text" name="mask" placeholder="Letter to show" v-model="mask" @change="handleChangeMask" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const getVisibleLetters = (password: string, mask: number[]): string => {
  return mask
    .reduce((acc: string[], maskNumber: number) => {
      acc.push(password[Number(maskNumber) - 1]);
      return acc;
    }, [])
    .join('');
};

const createMask = (password: string, mask: string) => {
  return mask
    .split(' ')
    .filter((str: string) => str && !isNaN(Number(str)))
    .map((str) => Number(str))
    .filter((number) => number > 0 && password.length >= number);
};

export default {
  data() {
    return {
      password: '',
      lettersToShowCollection: new Set(),
      mask: '',
    };
  },
  computed: {
    unmaskedPassword(): string {
      const mask = createMask(this.password, [...this.lettersToShowCollection].sort((a, b) => a - b).join(' '));

      return getVisibleLetters(this.password, mask);
    },
  },

  methods: {
    letterClickHandler(letterPosition: number) {
      if (!this.lettersToShowCollection.has(letterPosition)) {
        this.lettersToShowCollection.add(letterPosition);
      }
    },

    shouldBeUnmasked(letterPosition: number) {
      return this.lettersToShowCollection.has(letterPosition);
    },

    handleChangeMask(event) {
      this.lettersToShowCollection.clear();
      createMask(this.password, event.target.value)
        .filter((letterPosition) => {
          return !this.lettersToShowCollection.has(letterPosition);
        })
        .forEach((letterPosition) => {
          this.lettersToShowCollection.add(letterPosition);
        });
    },
  },
  watch: {
    password(val) {
      if (!val) {
        this.lettersToShowCollection.clear();
        this.mask = '';
      }
    },
  },
};
</script>

<style module lang="scss">
.wrapper {
  background: #f2f2f2;
  height: 100vh;
  lost-align: center;

  & > div {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
}

.row {
  &:not(first-child) {
    margin-top: 20px;
  }
  input {
    background: #eaebeb;
    outline-color: #e35f75;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
  }

  &.passwordLetters {
    display: flex;
    flex-direction: row;
  }
}

.letterItem {
  cursor: pointer;
  padding: 5px;

  p {
    text-align: center;
    color: #d2d2d2;
  }

  &.letterVisible {
    & .letter {
      background: transparent;
    }
    p {
      color: #b7bbbd;
    }
  }
}

.letter {
  width: 20px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #d2d2d2;
  border-radius: 4px;

  &:hover {
    background: #b7bbbd;
  }
}
</style>
