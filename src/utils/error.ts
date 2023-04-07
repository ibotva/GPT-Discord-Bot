export default class Exception {
    static MISSING_OPTION_EXCEPTION(missing_value: string) {
        return new Error(`Value missing from {opts} object: ${missing_value}`)
    }

    static get MISSING_DATA_EXCEPTION() {
        return new Error("Please add a data function to your command")
    }

    static MISSING_EXECUTE_EXCEPTION() {
        return new Error("Please add execute function to your command")
    }
}