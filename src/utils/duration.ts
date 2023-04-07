
export default function duration(opts: {
    miliseconds?: number,
    seconds?: number,
    minutes?: number,
    hours?: number,
    days?: number,
    weeks?: number,
    months?: number
    years?: number
}) {
    let ms = opts.miliseconds || 0

    if (opts.seconds) {
        ms += opts.seconds * 1000
    }

    if (opts.minutes) {
        ms+= opts.minutes * 60000
    }

    if (opts.hours) {
        ms += opts.hours * 3600000
    }

    if (opts.days) {
        ms += opts.days * 86400000
    }

    if (opts.weeks) {
        ms += opts.weeks * 604800000
    }

    return ms
}