<script lang="ts">
    export let checked = false
</script>

<label class="toggle-container"><input bind:checked type="checkbox"><span
        class="slider"
></span></label>

<style>
    input {
        appearance: none;
    }

    .slider {
        cursor: pointer;
        background-color: gray;
        border-radius: 20px;
        width: 40px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .toggle-container {
        position: relative;
        margin: auto;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: var(--orange);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--faded-orange);
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(22px);
        -ms-transform: translateX(22px);
        transform: translateX(22px);
    }
</style>