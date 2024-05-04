<script lang="ts">
  import { Color } from "../color";

  export let label: string = "default";
  export let checked: boolean;

  export let color: Color = Color.neutral;
  export let code = false;
</script>

<label
  on:click={() => {
    checked = !checked;
  }}
  for={label}
  style:font-family={code ? "OpenDyslexicMono" : ""}
  ><span>{label}</span>
  <input type="checkbox" name={label} bind:checked />
</label>
<div>
  <span
    on:click={() => {
      checked = !checked;
    }}
    class="checkmark"
    class:checked
    class:neutral={color === Color.neutral}
    class:blue={color === Color.blue}
    class:orange={color === Color.orange} />
</div>

<style>
  label {
    text-align: right;
  }

  span {
    text-align: right;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    width: 2em;
    height: 2em;
    border-radius: 0.4em;
    display: block;
  }

  .checkmark:after {
    display: none;
    content: "";
  }

  span.checkmark.checked:after {
    display: block;
    position: relative;
    left: 0.55em;
    top: 0.2em;
    width: 0.5em;
    height: 1em;
    border: solid var(--gray);
    border-width: 0 0.35em 0.35em 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
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
