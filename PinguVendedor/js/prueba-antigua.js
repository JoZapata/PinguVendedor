/**********************
	Variables globales
***********************/


var listaCompras = [];	// lista de productos a comprar
var total_compra = 0.0;	// precio total a gastar
var tam_compra = 0;		// contador de productos en la lista
var listaProductos;		// dinamico


var isEmptyListGenerated = false; // variable para verificar la lista en 0

var compras = [];
var compras2 = [];

/**********************
  Listado de objetos
***********************/

var productos =
{
	pescado:[
		{id:"psc-1", name:"1 kg de pescado", precio: 30.60},
		{id:"psc-2", name:"2 kg de pescado", precio: 55.80},
		{id:"psc-3", name:"3 kg de pescado", precio: 105.20}
	],

	pollo:[
		{id:"pol-1", name:"1kg de pollo", precio: 20.40},
		{id:"pol-2", name:"2kg de pollo", precio: 38.90},
		{id:"pol-3", name:"3kg de pollo", precio: 74.60}
	],

	atun:[
		{id:"atn-1", name:"1 lata de atun", precio: 3.60},
		{id:"atn-4", name:"4 lata de atun", precio: 14.40},
		{id:"atn-6", name:"6 lata de atun", precio: 21.60}
	],

	sardina:[
		{id:"sdn-1", name:"1 lata de sardina", precio: 5.20},
		{id:"sdn-3", name:"3 lata de sardina", precio: 15.60},
		{id:"sdn-5", name:"5 lata de sardina", precio: 26.00}
	]
};

/**********************
  Funciones de inicio
***********************/

ventana_tienda ();
//cargar parametros iniciales de juego
cargarNivel(1);

// dialogs
$( function() {
    $( "#successfulDialog" ).dialog({    	
      	autoOpen: false,
      	modal: true,
        show: {
        effect: "blind",
        duration: 500
      }
    });

    $( "#failDialog" ).dialog({    	
      	autoOpen: false,
      	modal: true,
        show: {
        effect: "blind",
        duration: 500
      }
    });

} );

function diposeDialog(argument) {
	$(argument).dialog('destroy').remove();
}

/**********************
  Funciones del nivel 1
***********************/

function generarCompras(){
	var comprasJugador =[];

	if(!isEmptyListGenerated){
		generateEmptyBuyList(compras);
		isEmptyListGenerated = true;
		console.log("listaCompras: "+listaCompras);
		console.log("listavacia: "+compras);
	}
	console.log("Dinero: "+total_compra);

	//obtenemos todos las id de todos los radio chequeados
	comprasJugador = obtenerCompras();

	//eliminamos valor extra de los id parseando la cadena
	comprasJugador = parsearlistaCompras(comprasJugador);

	//procedemos a la validacion de los objetos
	//comprados contra los requeridos

	if(isMoneyLeft(comprasJugador)){
		realizarCompras(comprasJugador);
		var isObjective = isObjectiveComplete(compras);
		if(isObjective){
			//alert("GANASTE");
			$( "#successfulDialog" ).dialog( "open" );
			close_shop();
			cargarNivel(2);
		}
	}else{
		alert("Perdiste el juego ya no puedes comprar :'( ");
	}
	console.log("compras: "+compras);
	clearOptions(comprasJugador);
}

function comprarProducto(id){
		//funcion que toma el id y verifica si es importante para la compra
		var isInShopList = isInList(id);
		//funcion que verifica si ya se compro la cantidad deseada de ese id

		var precioProducto = getPriceById(id);
		var total_compra_aux = total_compra - precioProducto;
		total_compra_aux = total_compra_aux.toFixed(2);

		if(isInShopList){
			var isGoal = isGoalAchieved(id,compras);
			if(!isGoal){
				//como no se ha logrado el objetivo se actualiza el precio
				total_compra = total_compra_aux;
				actualizarPrecio(total_compra);
			}else{
				/*
				ya que el objetivo de ese tipo de producto ya se cumplio  se inserta el
				equivalente de ese id de la lista de compras
				*/
				var res = id.split("-");
				for( var i =0; i < listaCompras.length; i++){
					var objective = listaCompras[i];
					var res2 = listaCompras[i].split("-");
					if(res[0] == res2[0]){
						break;
					}
				}
				total_compra = total_compra_aux;
				actualizarDatos(objective,total_compra);
			}
		}else{
			//no es necesario realizar esa compra solo se disminuye dinero
			total_compra = total_compra_aux;
			actualizarPrecio(total_compra);
		}
}

/**********************
  Funciones del nivel 2
***********************/

function generarCompras2() {
	var comprasJugador =[];
	var isValidPurchase = false;

	if(!isEmptyListGenerated){
		generateEmptyBuyList(compras2);
		isEmptyListGenerated = true;
	}

	//obtenemos todos las id de todos los radio chequeados
	comprasJugador = obtenerCompras();

	//eliminamos valor extra de los id parseando la cadena
	comprasJugador = parsearlistaCompras(comprasJugador);

	//procedemos a obtener la prioridad de los productos
	var products_priorities = generateAleatoryPriorities(listaProductos);
	var mediumPriority = getMediumPriority(products_priorities);

	//procedemos a la validacion de los objetos
	//comprados contra los requeridos

	if(isMoneyLeft(comprasJugador)){
		realizarCompras(comprasJugador);
		var prioridad = obtenerPrioridad(compras2,products_priorities);
		var isObjective = isObjectiveComplete(compras2);
		if(isObjective || prioridad >= mediumPriority){
			//alert("GANASTE");
			$( "#successfulDialog" ).dialog( "open" );
			close_shop();
			cargarNivel(3);
		}
	}else{
		alert("Perdiste el juego ya no puedes comprar");
	}

	//console.log("compras: "+compras2);
	clearOptions();
}

/**
 * Realizar la compra del producto del lvl 2
 */
function comprarProducto2(id){

	//funcion que toma el id y verifica si es importante para la compra
	var isInShopList = isInList(id);
	//funcion que verifica si ya se compro la cantidad deseada de ese id

	var precioProducto = getPriceById(id);
	var total_compra_aux = total_compra - precioProducto;
	total_compra_aux = total_compra_aux.toFixed(2);

	if(isInShopList){
		var isGoal = isGoalAchieved(id,compras2);
		if(!isGoal){
			//como no se ha logrado el objetivo se actualiza el precio
			total_compra = total_compra_aux;
			actualizarPrecio(total_compra);
		}else{
			/*
			ya que el objetivo de ese tipo de producto ya se cumplio  se inserta el
			equivalente de ese id de la lista de compras
			*/
			var res = id.split("-");
			for( var i =0; i < listaCompras.length; i++){
				var objective = listaCompras[i];
				var res2 = listaCompras[i].split("-");
				if(res[0] == res2[0]){
					break;
				}
			}
			total_compra = total_compra_aux;
			actualizarDatos(objective,total_compra);
		}
	}else{
		//no es necesario realizar esa compra solo se disminuye dinero
		total_compra = total_compra_aux;
		actualizarPrecio(total_compra);
	}
}

/**
 * Metodo para obtener la prioridad promedio que el jugador
 * debe de tener para ganar
 *
 * @param {products} lista de productos por comprar con sus respectivas prioridades
 * @return {medium_priority} prioridad minima para ganar
 */
function getMediumPriority(products) {
	var medium_priority = 0;
	var pdcts_len = products.length;

	for (var i = 0; i < pdcts_len; i++) {
		medium_priority = medium_priority + products[i].priority;
	}
	medium_priority = Math.floor(medium_priority/pdcts_len);

	return medium_priority;
}

function obtenerPrioridad(compras,product_priorities){
	var prioridadAcumulada =0;
	for(var i =0; i< product_priorities.length;i++){
		var producto = product_priorities[i].product;
		if(compras2.indexOf(producto)!=-1){
			prioridadAcumulada += product_priorities[i].priority;
		}
	}
	return prioridadAcumulada;
}

/**********************
  Funciones compartidas
	entre niveles.
***********************/

/**
 * Hacer las validaciones de una compra
 * segun sus proridades
 *
 * @param {comprasJugador} Compras hechas por el jugador
 */
function validarCompras(compra) {

	var isValidPurchase = false;
	var precioProducto = getPriceById(compra);

	var calculo = total_compra - precioProducto;
	calculo = calculo.toFixed(2);

	if(calculo >=0 ){
		isValidPurchase = true;
	}else{
		isValidPurchase = false;
	}

	return isValidPurchase;
}

function realizarCompras(comprasJugador){

	var noComprados = [];
	var comprados = [];

		var ICJ =0;
		for( ICJ = 0; ICJ < comprasJugador.length; ICJ++){
			var id = comprasJugador[ICJ];
			var isValidPurchase = validarCompras(id);

			if (isValidPurchase) {
				comprarProducto(id);
				comprados.push(id);
			}else{
				noComprados.push(id);
			}
		}
		alert("se compraron los productos: \n" + comprados);
		alert("no se pudieron comprar los productos: \n"+noComprados);

}

/**********************
	Funciones de Validacion
***********************/

/**
 * Verificar si se puede comprar al menos uno de
 * los productos de una lista de productos comprados
 *
 * @param {comprasJugador} identificador del producto
 * @return {isValid} Respuesta si es posible o no
 */
function isMoneyLeft(comprasJugador){
	var isValid = false;

	if(comprasJugador.length != 0){
		for(var i=0; i<comprasJugador.length;i++ ){
				var price = getPriceById(comprasJugador[i]);
				//console.log("Art: "+comprasJugador[i]);
				//console.log("Precio art: "+price);
				//console.log(price<=total_compra);
				if(price <= total_compra){
					isValid = true;
				}
		}
	}else{
			isValid = true;
	}

	return isValid;
}

function isObjectiveComplete(lista){
	var result = true;
	for(var i =0; i < lista.length; i++){
		var res = lista[i].split("-");
		var res2 = listaCompras[i].split("-");

		var target = parseInt(res[1]);
		var objective = parseInt(res2[1]);

		if( target < objective ){
			result = false;
		}
	}
	return result;
}

function isInList(id){
	var result = false;
	var res2 = id.split("-");

	for(var i =0; i < listaCompras.length; i++){
		var res = listaCompras[i].split("-");
		if (res[0] == res2[0]){
			result = true;
		}
	}

	return result;
}

function isGoalAchieved(id,lista){
	var result = false;
	var res = id.split("-");

	for( var i =0; i < listaCompras.length; i++){
		var res2 = listaCompras[i].split("-");
		if(res[0] == res2[0]){
			break;
		}
	}

	for(var i =0; i < lista.length; i++){
		var res3 =lista[i].split("-");
		if(res[0] == res3[0]){
			var objectiveIndex = i;
			break;
		}
	}

	//ya tenemos el valor
	var objective = parseInt(res2[1]);
	var actual = parseInt(res3[1]);
	var target = parseInt(res[1]);
	var sum = actual + target;

	if( sum >= objective ){
		result = true;
	}

	var index = lista.indexOf(lista[objectiveIndex]);
	lista[index] = res[0] + "-" + (sum).toString();

	return result;
}

/**********************
	Funciones de Middleware
***********************/

function actualizarPrecio(total_compra){
	document.getElementById("money").innerHTML=total_compra;
}

function actualizarDatos(id,total_compra){
	console.log(id);
	var check = document.getElementById(id);
	if( check.checked != true){
			document.getElementById(id).checked = true;
			actualizarPrecio(total_compra);
	}
}

function clearOptions(comprasJugador){

	for( var i = 0; i < comprasJugador.length; i++){
		var id = comprasJugador[i];
		var id = "opt-"+id;
		var check = document.getElementById(id);
		if( check.checked == true){
				document.getElementById(id).checked = false;
		}
	}
}

/**
 * Reestructurar el formato, de los id que
 * provienen de los checkboxes
 *
 * @param {comprasOriginal} id's con los guiones
 * @return {comprasNuevo} id´s con la estructura correcta
 */
function parsearlistaCompras(comprasOriginal){

	var comprasNuevo =[];
	for(var i =0; i < comprasOriginal.length; i++){
		var res = comprasOriginal[i].split("-");
		var id = "";
		id = res[1] + "-" + res[2];
		comprasNuevo.push(id);
	}
	return comprasNuevo;
}

function añadirDatos(producto){

	var cheq = crearCheckbox(producto);
	var label = crearLabel(producto,cheq);
	var breakpoint = document.createElement("BR");

	document.getElementById("demo").appendChild(cheq);
	document.getElementById("demo").appendChild(label);
	document.getElementById("demo").appendChild(breakpoint);
}

/**********************
	Funciones de Utilidad
***********************/

function añadirItemListaCompras(producto) {
	listaCompras.push(producto.id);
}

/**
 * obtener el precio de un producto respecto a su id
 * el objeto debe de estar en lista
 *
 * @param {id} identificador del producto
 * @return {precioProducto} precio del producto
 */
function getPriceById(id){
	var iLP = 0; // indice para la listaProductos

	for (iLP = 0; iLP < listaProductos.length; iLP++) {

		var productoNombre = listaProductos[iLP]; // nombre del producto a buscar
		var producto = productos[productoNombre]; // objeto producto del JSON
		var iP = 0; 							  // indice del objeto producto

		for (iP = 0; iP < producto.length; iP++) {
			// si es el id, se regresa el precio del produto
			if ( producto[iP].id == id) {
				var precioProducto = producto[iP].precio;	// precio del producto

				precioProducto = precioProducto.toFixed(2);
				return precioProducto;
			}
		}
	}
}

/**
 * Obtencion de los id de los radios buttons
 * seleccionados
 *
 * @return {comprasJugador} lista de id´s de los radios buttons
 */
 var purchases = [];
function obtenerCompras(){
	purchases = [];
	var searchEles = document.getElementById("shop").children;
	obtenerDatos(searchEles);
	return purchases;
}

function obtenerDatos(searchEles){

	for(var i =0; i < searchEles.length; i++){
		if(searchEles[i].tagName == 'DIV'){
			obtenerDatos(searchEles[i].children);
		}
		if(searchEles[i].tagName == 'INPUT'){
			if(searchEles[i].checked == true){
				purchases.push(searchEles[i].id);
			}
		}
	}
}

/**
 * obtener un producto aleatorio de una lista
 * de productos
 *
 * @param {producto} lista de productos donde se seleccionara
 * @return {randomProduct} producto aleatorio
 */
function getRandomProduct(producto){
	var randomProduct = producto[Math.floor(Math.random() * producto.length)];
	return randomProduct;
}

function calcularTotalCompra(producto){
	total_compra = total_compra + producto.precio;
	tam_compra = tam_compra + 1;
	return [total_compra,tam_compra];
}

function calcularDineroDisponible(total_compra){

	total_compra = total_compra.toFixed(2);			// redondear el total a dos decimales
	var dinero_disponible = document.createElement("LABEL");
	dinero_disponible.id ="money";
	var texto_dinero = document.createTextNode(total_compra);
	dinero_disponible.appendChild(texto_dinero);
	document.getElementById("total").appendChild(dinero_disponible);
}

/**
 * obtener un producto aleatorio de una lista
 * de productos
 *
 * @param {producto} lista de productos donde se seleccionara
 * @return {randomProduct} producto aleatorio
 */
function getRandomProduct(producto){
	var randomProduct = producto[Math.floor(Math.random() * producto.length)];
	return randomProduct;
}

/**
 * obtener un entero aleatorio entre un rango [min, max)
 * Usando Math.round() te dará una distribución no-uniforme
 *
 * @param {min} valor minimo del rango(incluido)
 * @param {max} valor maximo del rango(excluido)
 * @return {randomInteger} entero aleatorio
 */
function getRandomInt(min, max) {
	var randomInteger = Math.floor(Math.random() * (max - min)) + min;
	return randomInteger;
}

/**
 * Obtener el dinero disponible para el nivel 2
 *
 * @param {total_purchase} total de dinero disponible para comprar
 * @return {new_total_purchase} nueva cantidad de dinero para comprar
 */
function getAvailableMoneyLv2(total_purchase) {
	var new_total_purchase = total_purchase/2;
	return new_total_purchase;
}

function seleccionarNivel(nivel){
	var boton = document.getElementById("comprarbutton");
	isEmptyListGenerated = false;
	if(nivel == 1){
		boton.onclick = generarCompras;
		compras = [];
	}
	if(nivel == 2){
		boton.onclick = generarCompras2;
		compras2 = [];
	}
	if(nivel >2){
		alert("ya no hay mas");
	}
}

function generateEmptyBuyList(lista){
	for(var i = 0; i < listaCompras.length;i++){
		var res = listaCompras[i].split("-");
		var zero = 0;
		res = res[0] + "-" +zero.toString();
		lista.push(res);
	}
}

function crearArrayProductos(productos) {
	var listaProductos = [];
	for ( var elemento in productos ) {
		listaProductos.push(elemento);
	}
	return listaProductos;
}

function cargarNivel(nivel){
	clearPrice();
	listaProductos = [];
	total_compra = 0.0;
	tam_compra = 0;

	listaProductos = crearArrayProductos(productos);
	shuffle(listaProductos);
	crearListaProductos(productos,total_compra,tam_compra);

	seleccionarNivel(nivel);
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(array) {
    var j, x, i;
    for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}

function crearListaProductos(productos, total_compra, tam_compra){
	var i,j;
	var element;
	var count;
	var producto;			// producto de la lista
	var compra_minima = 4;	// cantidad de productos minimos en una lista

	clearProductList();

	for (j = 0; j < listaProductos.length; j++ ) {
		producto = productos[listaProductos[j]];
		flag =1;
		index=0;
		count =0;

		var productoAleatorio = getRandomProduct(producto);
		añadirItemListaCompras(productoAleatorio);
		añadirDatos(productoAleatorio);

		valores_totales = calcularTotalCompra(productoAleatorio);
		total_compra = valores_totales[0];
		tam_compra = valores_totales[1];
	}
	calcularDineroDisponible(total_compra);
}

/**
 * Genera prioridades para una lista de productos
 *
 * @param {products} lista de productos por comprar
 * @return {products_priorities} lista de productos por comprar con sus respectivas prioridades
 */
function generateAleatoryPriorities(products) {
	var lowest_priority = 0;
	var top_priority = 5;
	var pdcts_len = products.length;
	var products_priorities = products.slice();	// copiar un arreglo por valor

	for (var i = 0; i < pdcts_len; i++) {
		var priority = getRandomInt(lowest_priority,top_priority);
		var product = products[i];
		products_priorities[i] = {product,priority};
	}

	return products_priorities;
}

/**
 * configuracion de la ventana modal
 */

function close_shop() {
	var modal = document.getElementById('modalTienda');
	modal.style.display = "none";
}

function ventana_tienda () {

	var modal = document.getElementById('modalTienda');
	var btn = document.getElementById("BtnIrTienda");
	var span = document.getElementsByClassName("close")[0];
	
	var modalHelp = document.getElementById('modalhelp');
	var helpBtn = document.getElementById("helpBtn");
	var spanHelp = document.getElementsByClassName("close")[1];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks on the button, open the modal 
	helpBtn.onclick = function() {
	    modalHelp.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	spanHelp.onclick = function() {
	    modalHelp.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modalHelp) {
	        modalHelp.style.display = "none";
	    }
	}
}

function crearCheckbox(producto){

	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type","checkbox");
	checkbox.disabled = true;
	checkbox.id = producto.id;
	checkbox.name =producto.name;

	return checkbox;
}

function crearLabel(producto,cheq){

	var label = document.createElement("LABEL");
	var text = document.createTextNode(producto.name);

	label.setAttribute("for",cheq.id);
	label.appendChild(text);
	return label;
}

function clearPrice(){
	var list = document.getElementById("total");
	for(var i=0; i < list.childNodes.length;i++){
		var child = list.childNodes[i].id;
		if(child != null){
			if ( ( (child).localeCompare("money") ) == 0) {
				var item = document.getElementById("money");
				item.parentNode.removeChild(item);
			}
		}
	}
}

function clearProductList(){

	var div = document.getElementById("demo");
	var index = div.childNodes.length;
	for(var i = 0; i < index; i++){
		demo.removeChild(div.childNodes[0]);
	}
}
