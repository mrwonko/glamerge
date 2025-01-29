const targetGLAButton = document.getElementById('targetGLAFilePickerButton') as HTMLInputElement;
const targetConfigButton = document.getElementById('targetConfigFilePickerButton') as HTMLInputElement;
const targetConfigWarning = document.getElementById('targetConfigFileWarning') as HTMLSpanElement;
const sourceGLAButton = document.getElementById('sourceGLAFilePickerButton') as HTMLInputElement;
const sourceConfigButton = document.getElementById('sourceConfigFilePickerButton') as HTMLInputElement;
const sourceConfigWarning = document.getElementById('sourceConfigFileWarning') as HTMLSpanElement;
const loadButton = document.getElementById('loadButton') as HTMLButtonElement;

// the "files is FileList" type guard assures typescript that files is not null if the return value is true
const filesAvailable = (files: FileList | null): files is FileList => files !== null && files.length > 0;

const fileChanged = () => {
    loadButton.disabled = !(filesAvailable(targetGLAButton.files) && filesAvailable(targetConfigButton.files) && filesAvailable(sourceGLAButton.files) && filesAvailable(sourceConfigButton.files));
    targetConfigWarning.innerHTML = (filesAvailable(targetConfigButton.files) && targetConfigButton.files[0].name !== 'animation.cfg') ? 'Warning: expected file called "animation.cfg"' : '';
    sourceConfigWarning.innerHTML = (filesAvailable(sourceConfigButton.files) && sourceConfigButton.files[0].name !== 'animation.cfg') ? 'Warning: expected file called "animation.cfg"' : '';
}

const load = () => {
    console.log(`todo: load ${targetGLAButton.files} ${targetConfigButton.files} ${sourceGLAButton.value} ${sourceConfigButton.value}`);
}
