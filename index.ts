type NameCheckingInput = {
    Input: HTMLInputElement;
    Warning: HTMLSpanElement;
    ExpectedName?: string;
    ExpectedSuffix?: string;
}
type InputGroup = {
    GLA: NameCheckingInput;
    Animation: NameCheckingInput; // animation.cfg
    Events: NameCheckingInput; // animevents.cfg
};
type ArrayBufferGroup = {
    GLA: ArrayBuffer;
    Animation: ArrayBuffer;
    Events: ArrayBuffer | null;
};
const targetInputs: InputGroup = {
    GLA: {
        Input: document.getElementById('targetGLAFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('targetGLAFileWarning') as HTMLSpanElement,
        ExpectedSuffix: ".gla",
    },
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
    GLA: {
        Input: document.getElementById('sourceGLAFilePickerButton') as HTMLInputElement,
        Warning: document.getElementById('sourceGLAFileWarning') as HTMLSpanElement,
        ExpectedSuffix: ".gla",
    },
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

const {
    setLoading, fileChanged,
} = (() => { // IIFE for encapsulation
    const checkName = (input: NameCheckingInput) => {
        const message: string = (() => {
            if (!filesAvailable(input.Input.files)) {
                return '';
            }
            const name = input.Input.files[0].name;
            if (input.ExpectedName !== undefined && !name.startsWith(input.ExpectedName)) {
                return `Warning: expected file called "${input.ExpectedName}"`;
            }
            if (input.ExpectedSuffix !== undefined && !name.endsWith(input.ExpectedSuffix)) {
                return `Warning: expected file ending in ${input.ExpectedSuffix}`;
            }
            return '';
        })();
        input.Warning.innerHTML = message;
    }
    const setInputGroupDisabled = (inputGroup: InputGroup, value: boolean) => {
        inputGroup.GLA.Input.disabled = value;
        inputGroup.Animation.Input.disabled = value;
        inputGroup.Events.Input.disabled = value;
    }
    var loading = false;
    const enableLoadButton = () =>
        filesAvailable(sourceInputs.GLA.Input.files) && filesAvailable(sourceInputs.Animation.Input.files) &&
        filesAvailable(targetInputs.GLA.Input.files) && filesAvailable(targetInputs.Animation.Input.files) &&
        !loading;
    const refreshLoadButton = () => {
        loadButton.disabled = !enableLoadButton();
    };
    return {
        setLoading: (value: boolean) => {
            loading = value;
            setInputGroupDisabled(sourceInputs, value);
            setInputGroupDisabled(targetInputs, value);
            refreshLoadButton();
        },
        fileChanged: () => {
            checkName(sourceInputs.GLA);
            checkName(sourceInputs.Animation);
            checkName(sourceInputs.Events);
            checkName(targetInputs.GLA);
            checkName(targetInputs.Animation);
            checkName(targetInputs.Events);
            refreshLoadButton();
        },
    }
})();


const readBinaryFile = async (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

const maybeAsync = <Input, Output>(f: (arg: Input) => Promise<Output>): (arg: Input | null) => Promise<Output | null> => {
    return async (arg: Input | null) => arg === null ? null : f(arg);
}

const maybeReadBinaryFile = maybeAsync(readBinaryFile);

const readInputGroup = async (inputGroup: InputGroup): Promise<ArrayBufferGroup> => {
    const eventFiles = inputGroup.Events.Input.files;
    const eventFile = filesAvailable(eventFiles) ? eventFiles[0] : null;
    const [gla, animation, events] = await Promise.all([
        readBinaryFile(inputGroup.GLA.Input.files![0]),
        readBinaryFile(inputGroup.Animation.Input.files![0]),
        maybeReadBinaryFile(eventFile)
    ]);
    return {
        GLA: gla,
        Animation: animation,
        Events: events,
    };
}

const load = async () => {
    setLoading(true);
    try {
        const [source, target] = await Promise.all([
            readInputGroup(sourceInputs),
            readInputGroup(targetInputs),
        ]);
        console.log("files loaded");
    } finally {
        setLoading(false);
    }
}
