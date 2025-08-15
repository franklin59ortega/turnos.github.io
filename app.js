document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const fechaInput = document.querySelector("#fecha");
        const turnoInput = document.querySelector("#turno");
        const fechaEntrada = new Date(fechaInput.value);
        const diasTrabajo = getDiasTrabajo(turnoInput.value, fechaEntrada);
        mostrarCalendario(diasTrabajo);
    });
});

function getTurnoActual(turno, diasDesdeInicio) {
    const turnos = ["mañana", "noche", "tarde"];
    const indiceTurno = turnos.indexOf(turno);
    return turnos[(indiceTurno + Math.floor(diasDesdeInicio / 6)) % 3];
}

function getDiasTrabajo(turno, fechaInicio) {
    const diasTrabajo = [];
    let fechaActual = new Date(fechaInicio);
    let turnoActual = turno;
    let diasEnTurno = 0;
    const diasPorTurno = 6;
    const diasDescanso = 2;

    for (let i = 0; i < 365; i++) {
        const esDiaDescanso = diasEnTurno >= diasPorTurno && diasEnTurno < diasPorTurno + diasDescanso;
        if (esDiaDescanso) {
            diasTrabajo.push({
                fecha: fechaActual.toISOString().split("T")[0],
                turno: "Descanso",
                esDescanso: true,
            });
        } else {
            diasTrabajo.push({
                fecha: fechaActual.toISOString().split("T")[0],
                turno: turnoActual,
                esDescanso: false,
            });
        }

        diasEnTurno++;
        if (diasEnTurno >= diasPorTurno + diasDescanso) {
            diasEnTurno = 0;
            turnoActual = ["mañana", "noche", "tarde"][(["mañana", "noche", "tarde"].indexOf(turnoActual) + 1) % 3];
        }

        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return diasTrabajo;
}

/**
 * Muestra el calendario de días de trabajo con su respectivo turno
 * @param {object[]} diasTrabajo - Arreglo de objetos con la fecha, el turno correspondiente y un indicador de si es un día de descanso o no
 */
function mostrarCalendario(diasTrabajo) {
    const calendarEl = document.getElementById("calendar");
    const events = diasTrabajo.map(dia => ({
        title: dia.esDescanso ? "Descanso" : `${dia.turno}`,
        start: dia.fecha,
        color: dia.esDescanso ? "black" : {
            mañana: "orange",
            noche: "blue",
            tarde: "green",
        }[dia.turno],
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        firstDay: 1,
        locale: 'es',
        events,
        dayCellClassNames: function(arg) {
            const today = new Date();
            if (arg.date.getDate() === today.getDate() &&
                arg.date.getMonth() === today.getMonth() &&
                arg.date.getFullYear() === today.getFullYear()) {
                return ['current-day'];
            }
            return [];
        }
    });

    calendar.render();
}

