<script lang="ts">
  import { Color } from "../color";

  export let label: string = "default";
  export let value: string;

  export let color: Color = Color.neutral;
  export let code = false;
</script>

<label for={label} style:font-family={code ? "OpenDyslexicMono" : ""}
  >{label}</label>
<input
  type="text"
  name={label}
  bind:value
  class:neutral={color === Color.neutral}
  class:blue={color === Color.blue}
  class:orange={color === Color.orange} />

<style>
  label {
    text-align: right;
  }
  .neutral {
    background-color: var(--neutral);
  }
  .blue {
    background-color: var(--blue);
  }
  .orange {
    background-color: var(--orange);
  }
</style>
