let pagina = 1;
let numeroCita = localStorage.getItem('ultimaCita') ? localStorage.getItem('ultimaCita') : 0;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [],
    totalServicio: 0
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
})

/*¿Que hace el codigo?
Inicialmente pasa por mostrarservicios para sacar el contenido del JSON, dependiendo si el servicio esta seleccionado o no se resalta gracias al
metodo seleccionarServicio.
Ahora pasa por mostrar seccion con el valor inicial de pagina=1 y agrega las repectivas clases.
Luego de esto pasa por cambiarSeccion que elimina las clases que se habian puesto y las agrega a la nueva seccion
Es decir, si las clases de mostrar-servicio y actual estaban en 1, al seleccionar otra seccion se eliminan estas clase,
Y se van a la nueva seccion como por ejemplo resultado*/

function iniciarApp() {
    mostrarServicios();
    //Resalta el div Actual segun el tab que se presiona
    mostrarSeccion();

    //Oculta o muestra el div segun el tab que se presiona
    cambiarSeccion();

    //Paginacion
    btnSiguiente();
    btnAnterior();

    btnPaginador();

    mostrarResumen();

    nombreCita();

    fechaCita();

    deshabilitarFechaAnterior();

    horaCita();

}

function mostrarSeccion() {
    //Todo este metodo se hace para poder manejar las secciones desde los botones anterior/siguiente
    //Eliminar mostrar-seccion de la seccion anterior y reasignar
    const seccionAnt = document.querySelector('.mostrar-seccion');
    if (seccionAnt) {
        seccionAnt.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`); //Crear variable que sea igual al ID De las secciones Ejemplo: id="paso-1"
    seccionActual.classList.add('mostrar-seccion');//Agregarle la clase que sera la primera en verse

    //Eliminar actual de la seccion anterior y reasignar
    const seccionAct = document.querySelector('.actual');
    if (seccionAct) {
        seccionAct.classList.remove('actual');
    }

    //Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);//Crear variable que sea igual al data-paso="1" de los botones
    tab.classList.add('actual');//Agregar clase actual
    //Los valores iniciales son 1, y al pasar por el metodo de cambiar seccion se cambia el valor de la variable pagina, por lo cual se cambia todo 
}

function cambiarSeccion() {
    //Todo este metodo se hace para poder manejar las secciones desde la navegacion superior
    const enlaces = document.querySelectorAll('.tabs button')//Sacar cada enlace del html

    enlaces.forEach(enlace => { //Pasar por cada enlace y realizar lo solicitado
        enlace.addEventListener('click', e => {//Al hacer click
            e.preventDefault();//Prevenir accion por default
            pagina = parseInt(e.target.dataset.paso);//Pasar dato que hay en data-paso="1" a INT, puede ser 1 2 o 3

            //Eliminar mostrar-seccion de la seccion anterior y reasignar
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            const seccion = document.querySelector(`#paso-${pagina}`);//seleccionar id="paso-1"
            seccion.classList.add('mostrar-seccion');//Agregar clase

            //Eliminar actual de la seccion anterior y reasignar
            document.querySelector('.actual').classList.remove('actual');
            document.querySelector(`[data-paso="${pagina}"]`).classList.add('actual');

            //Para evitar este codigo se puede llamar el metodo de mostrarseccion() , sin embargo se deja el codigo aca para entender que hace cada cosa
            btnPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');//Anotado en el cuaderno
        const db = await resultado.json();
        const { servicios } = db;




        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;
            //DOMScripting
            //Generarnombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');


            //Generar precio servicio

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar DIV
            const divServicios = document.createElement('DIV');
            divServicios.classList.add('div-servicios');
            divServicios.dataset.idServicio = id;

            //Seleccion servicio para la cita
            divServicios.onclick = seleccionarServicio;

            //Agregar nombre y precio al div de servicios
            divServicios.appendChild(nombreServicio);
            divServicios.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(divServicios);
        });

    } catch (error) {
        console.log(error);
    }

}

function seleccionarServicio(e) {
    let elemento;//Crear variable LET

    if (e.target.tagName === 'P') { //Revisar el TagName del elemento al que se le da click y ver si es un parrafo
        elemento = e.target.parentElement; // Si es un parrafo convertir la variable elemento a su padre es decir el DIV
    } else {
        elemento = e.target; //Si no, el elemento es igual a DIV
    }

    if (elemento.classList.contains('seleccionado')) {//Si elemento tiene la clase seleccionado se remueve esta, sino se agrega
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        console.log(id);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado')
        const serviciosObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(serviciosObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;

    cita.servicios = servicios.filter(servicio => servicio.id !== id)
    console.log(cita);
}

function agregarServicio(serviciosObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, serviciosObj];
    console.log(cita);
}

function btnAnterior() {
    const anterior = document.querySelector('#anterior');
    anterior.addEventListener('click', function () {
        pagina--;
        console.log(pagina);
        btnPaginador();
    })
}

function btnSiguiente() {
    const siguiente = document.querySelector('#siguiente');
    siguiente.addEventListener('click', function () {
        pagina++;
        console.log(pagina);
        btnPaginador();
    })
}

function btnFinalizar(citaFinalizada) {
    const finalizar = document.querySelector('#finalizar');
    finalizar.addEventListener('click', function () {
        const userDataJSON = JSON.stringify(citaFinalizada);
        localStorage.setItem('ultimaCita', numeroCita);
        localStorage.setItem(`cita${numeroCita}`, userDataJSON);
        limpiarDatos();
    })
}

function btnPaginador() {
    const anterior = document.querySelector('#anterior');
    const siguiente = document.querySelector('#siguiente');
    const finalizar = document.querySelector('#finalizar');
    finalizar.classList.add('oculto');
    if (pagina === 1) {
        anterior.classList.add('oculto');
        siguiente.classList.remove('oculto');
    } else if (pagina === 2) {
        anterior.classList.remove('oculto');
        siguiente.classList.remove('oculto');
    } else if (pagina === 3) {
        anterior.classList.remove('oculto');
        siguiente.classList.add('oculto');
        finalizar.classList.remove('oculto');
        mostrarResumen();
    }
    mostrarSeccion();

}

function mostrarResumen() {
    const { nombre, fecha, hora, servicios } = cita;
    const resumenDiv = document.querySelector('.resumen-cita');

    const mensajeError = document.querySelector('.mensaje-error');
    if (mensajeError) {
        mensajeError.remove();
    }

    //Validar si hay algo dentro de los campos/objeto
    if (Object.values(cita).includes('') || cita.servicios.length === 0) {
        const noCita = document.createElement('P');
        noCita.textContent = 'Faltan datos por llenar (Servicios, nombre, fecha y/o hora)';
        noCita.classList.add('mensaje-error');

        resumenDiv.appendChild(noCita);
        return;
    }

    //Crear el resumen

    const resumen = document.querySelector('.resumen-todo');

    if (resumen) {
        resumen.remove();
    }

    //Contenedor General para los datos
    const resumenTodo = document.createElement('DIV');
    resumenTodo.classList.add('resumen-todo');
    resumenDiv.appendChild(resumenTodo);


    //Contenedor paraa los servicios
    const resumenServicios = document.createElement('DIV');
    resumenServicios.classList.add('resumen-servicios');
    resumenTodo.appendChild(resumenServicios);



    const nombreReserva = document.createElement('P');
    nombreReserva.innerHTML = `<span>Nombre: </span> ${nombre}`

    const fechaReserva = document.createElement('P');
    fechaReserva.innerHTML = `<span>Fecha: </span> ${fecha}`

    const horaReserva = document.createElement('P');
    horaReserva.innerHTML = `<span>Hora: </span> ${hora}`;

    const titulo = document.createElement('H3');
    titulo.classList.add('titulo');
    titulo.textContent = 'Resumen Servicios'

    resumenServicios.appendChild(titulo);

    let cantidad = 0;
    //Iterador sobre los servicios seleccionados
    servicios.forEach(servicio => {
        const { precio } = servicio;

        const contenedor_servicios = document.createElement('DIV');
        contenedor_servicios.classList.add('contenedor_servicios');

        const nombreServicio = document.createElement('P');
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt(totalServicio[1].trim());



        nombreServicio.textContent = servicio.nombre;
        precioServicio.textContent = precio;

        contenedor_servicios.appendChild(nombreServicio);
        contenedor_servicios.appendChild(precioServicio);


        resumenServicios.appendChild(contenedor_servicios);
    })


    resumenTodo.appendChild(nombreReserva);
    resumenTodo.appendChild(fechaReserva);
    resumenTodo.appendChild(horaReserva);
    resumenTodo.appendChild(resumenServicios);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $ ${cantidad}`;

    resumenTodo.appendChild(cantidadPagar);
    numeroCita++;
    cita.totalServicio = cantidad;
    btnFinalizar(cita);

}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');


    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        if (nombreTexto === '' || nombreTexto.length < 3) {
            console.log('No es valido');
            mostrarAlerta('Nombre no valido', 'error');

        } else {
            const alertaPrevia = document.querySelector('.alerta');
            if (alertaPrevia) {
                alertaPrevia.remove();
            }
            cita.nombre = nombreTexto;
            console.log(cita);

        }
    })
}

function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }


    const alert = document.createElement('DIV');
    alert.textContent = mensaje;
    alert.classList.add('alerta');

    if (tipo === 'error') {
        alert.classList.add('error');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3500);


    console.log(alert);
}

function fechaCita() {
    const inputFecha = document.querySelector('#fecha');

    inputFecha.addEventListener('input', e => {
        const fecha = new Date(e.target.value).getUTCDay();

        if ([0, 1].includes(fecha)) {
            e.preventDefault();
            inputFecha.value = '';
            mostrarAlerta('No atendemos domingos ni lunes', 'error')
        } else {
            cita.fecha = inputFecha.value;
            console.log(cita);
        }
    })

}

function deshabilitarFechaAnterior() {
    const fecha = document.querySelector('#fecha');

    const date = new Date();
    const year = date.getFullYear();
    const mes = date.getMonth() + 1;
    const dia = date.getDate();
    //AAAA-MM-DD
    const fechaActual = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;//Ternario
    console.log(fechaActual);

    fecha.min = fechaActual;

}

function horaCita() {
    const horaInput = document.querySelector('#hora');

    horaInput.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 21) {
            console.log('Hora no valida')
            mostrarAlerta('Hora no valida, rango de 10:00 a 21:00', 'error');
            setTimeout(() => {
                horaInput.value = '';
            }, 3500);
        } else {
            cita.hora = horaCita;
            console.log(cita)
        }
    })
}

function limpiarDatos() {
    // Reiniciar los valores en el objeto cita
    cita.nombre = '';
    cita.fecha = '';
    cita.hora = '';
    cita.servicios = [];
    cita.totalServicio = 0;

    // Eliminar las clases seleccionado de los elementos
    const elementosSeleccionados = document.querySelectorAll('.seleccionado');
    elementosSeleccionados.forEach(elemento => {
        elemento.classList.remove('seleccionado');
    });

    // Limpiar el resumen en la página
    const resumenDiv = document.querySelector('.resumen-cita');
    resumenDiv.innerHTML = '';

    // Reiniciar la página y la navegación
    pagina = 1;
    mostrarSeccion();
    btnPaginador();
}