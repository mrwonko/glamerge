type NameCheckingInput = {
    Input: HTMLInputElement;
    Warning: HTMLSpanElement;
    ExpectedName: string;
}
type InputGroup = {
    GLA: HTMLInputElement;
    Animation: NameCheckingInput; // animation.cfg
    Events: NameCheckingInput; // animevents.cfg
};
const targetInputs: InputGroup = {
    GLA: document.getElementById('targetGLAFilePickerButton') as HTMLInputElement,
    Animation: {
        Input: document.getElementById('targetAnimationFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('targetAnimationFileWarning') as HTMLSpanElement,
        ExpectedName: "animation.cfg",
    },
    Events: {
        Input: document.getElementById('targetEventsFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('targetEventsFileWarning') as HTMLSpanElement,
        ExpectedName: "animevents.cfg",
    },
};
const sourceInputs: InputGroup = {
    GLA: document.getElementById('sourceGLAFilePickerButton') as HTMLInputElement,
    Animation: {
        Input: document.getElementById('sourceAnimationFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('sourceAnimationFileWarning') as HTMLSpanElement,
        ExpectedName: "animation.cfg",
    },
    Events: {
        Input: document.getElementById('sourceEventsFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('sourceEventsFileWarning') as HTMLSpanElement,
        ExpectedName: "animevents.cfg",
    },
};
const loadButton = document.getElementById('loadButton') as HTMLButtonElement;

// the "files is FileList" type guard assures typescript that files is not null if the return value is true
const filesAvailable = (files: FileList | null): files is FileList => files !== null && files.length > 0;

const checkName = (input: NameCheckingInput) => {
    input.Warning.innerHTML = (filesAvailable(input.Input.files) && input.Input.files[0].name !== input.ExpectedName) ? `Warning: expected file called "${input.ExpectedName}"` : '';
}
const fileChanged = () => {
    checkName(sourceInputs.Animation);
    checkName(sourceInputs.Events);
    checkName(targetInputs.Animation);
    checkName(targetInputs.Events);
}

const load = () => {
    console.log(`todo: load`);
}
