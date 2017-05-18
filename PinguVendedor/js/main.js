/*
notas faltantes:
- que cada nivel se repita una cierta cantidad de veces
- mostrar prioridades en pantalla
- dialog final
- poner un score para presumir a sus amigos
- imagenes al seleccionar objetos (AJAX)
- checkbox dinamicos
- agregar instrucciones por nivel a la ayuda
*/


/**********************
	Global Variables
***********************/


var shoppingList = [];	// list de products a comprar
var availableMoney = 0.0;	// precio total a gastar
var productAmount = 0;		// contador de products en la list
var productList;		// dinamico

var actualLevel = 1; //nivel actual

var isEmptyListGenerated = false; // variable para verificar la list en 0

var shoppingCart = [];

/**********************
  Product List (JSON Format)
***********************/

var products =
{
	pescado:[
		{id:"psc-1", name:"1 kg de pescado", precio: 30.60, amount: "1 kg"},
		{id:"psc-2", name:"2 kg de pescado", precio: 55.80 , amount: "2 kg"},
		{id:"psc-3", name:"3 kg de pescado", precio: 105.20, amount: "3 kg"}
	],

	pollo:[
		{id:"pol-1", name:"1kg de pollo", precio: 20.40, amount: "1 kg"},
		{id:"pol-2", name:"2kg de pollo", precio: 38.90, amount: "2 kg"},
		{id:"pol-3", name:"3kg de pollo", precio: 74.60, amount: "3 kg"}
	],

	atun:[
		{id:"atn-1", name:"1 lata de atun", precio: 3.60, amount: "1 lata"},
		{id:"atn-4", name:"4 lata de atun", precio: 14.40, amount: "4 lata"},
		{id:"atn-6", name:"6 lata de atun", precio: 21.60, amount: "6 lata"}
	],

	sardina:[
		{id:"sdn-1", name:"1 lata de sardina", precio: 5.20, amount: "1 lata"},
		{id:"sdn-3", name:"3 lata de sardina", precio: 15.60, amount: "3 lata"},
		{id:"sdn-4", name:"4 lata de sardina", precio: 26.00, amount: "4 lata"}
	],
	frijol:[
		{id:"frj-1", name:"1 bolsa de frijol", precio: 5.20, amount: "1 bolsa"},
		{id:"frj-3", name:"3 bolsa de frijol", precio: 15.60, amount: "3 bolsa"},
		{id:"frj-5", name:"5 bolsa de frijol", precio: 26.00, amount: "5 bolsa"}
	],
	arroz:[
		{id:"arz-1", name:"1 bolsa de arroz", precio: 5.20, amount: "1 bolsa"},
		{id:"arz-3", name:"3 bolsa de arroz", precio: 15.60, amount: "3 bolsa"},
		{id:"arz-5", name:"5 bolsa de arroz", precio: 26.00, amount: "5 bolsa"}
	],
	azucar:[
		{id:"azu-1", name:"1 bolsa de azucar", precio: 5.20, amount: "1 bolsa"},
		{id:"azu-3", name:"3 bolsa de azucar", precio: 15.60, amount: "3 bolsa"},
		{id:"azu-5", name:"5 bolsa de azucar", precio: 26.00, amount: "5 bolsa"}
	],
	galleta:[
		{id:"gal-1", name:"1 paquete de galleta", precio: 5.20, amount: "1 paquete"},
		{id:"gal-3", name:"3 paquete de galleta", precio: 15.60, amount: "3 paquete"},
		{id:"gal-5", name:"5 paquete de galleta", precio: 26.00, amount: "5 paquete"}
	],
	jugo:[
		{id:"jug-1", name:"1 caja de jugo", precio: 5.20, amount: "1 caja"},
		{id:"jug-4", name:"4 caja de jugo", precio: 15.60, amount: "4 caja"},
		{id:"jug-6", name:"6 caja de jugo", precio: 26.00, amount: "6 caja"}
	],
	leche:[
		{id:"lec-1", name:"1 caja de leche", precio: 5.20, amount: "1 caja"},
		{id:"lec-3", name:"3 caja de leche", precio: 15.60, amount: "3 caja"},
		{id:"lec-5", name:"5 caja de leche", precio: 26.00, amount: "5 caja"}
	],
	pan:[
		{id:"pan-1", name:"1 barra de pan", precio: 5.20, amount: "1 barra"},
		{id:"pan-3", name:"3 barra de pan", precio: 15.60, amount: "3 barra"},
		{id:"pan-5", name:"5 barra de pan", precio: 26.00, amount: "5 barra"}
	],
	sandia:[
		{id:"san-1", name:"1 sandia", precio: 5.20, amount: "1"},
		{id:"san-2", name:"2 sandia", precio: 15.60, amount: "2"},
		{id:"san-3", name:"3 sandia", precio: 26.00, amount: "3"}
	]
};

var productList_Ordered;

/**********************
  Startup functions
***********************/

// A $( document ).ready() block.
$( document ).ready(function() {
    ////console.log( "ready!" );
		productList_Ordered = createProductArray(products);
		//we load the initial parameters of the game
		ventana_tienda ();
		loadNewLevel(actualLevel);
		loadSong(false);
});


function loadSong(isPaused){
	var audio = document.getElementById("audio");

	if(isPaused){
		audio.pause();
	}else{

		// Attach a timeupdate event to the video element, and execute a function if the current playback position has changed
		audio.addEventListener("timeupdate", myFunction);
		audio.autoplay = true;
		audio.load();
		//audio.loop = true;

		function myFunction() {
		    // Display the current position of the video in a p element with id="demo"
		    var t = audio.currentTime;
				time = parseInt(t);
				finishTime = 18.760242;
				var dif = time - finishTime;
				dif = dif.toFixed(2);

				if(dif >= 0){
					audio.currentTime = 0 ;
				}

		}
	}

}




// dialogs conf functions
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


function verify_first_radio_group(radioId) {

		// verificar si no hay imagen
		if (document.getElementById('imgGen1') == null) {
		var name = radioId.substr(4);	// eliminar # del id

		var img = document.createElement("IMG");
	    img.src = "imgs/alimentos/"+name+".png";
	    img.id = "imgGen1"

	    document.getElementById('imgOpc1').appendChild(img);


	    //modificar tam
	    var imgGen = document.getElementById('imgGen1');
		if(imgGen && imgGen.style) {
		    imgGen.style.height = '60px';
		    imgGen.style.width = '80px';
		}

	} else {
		var imgToRm = document.getElementById('imgGen1');
		imgToRm.parentNode.removeChild(imgToRm);
		verify_first_radio_group(radioId);
	}
}

function verify_second_radio_group(radioId) {

	//verificar si no hay otro imgn
	if (document.getElementById('imgGen2') == null) {
		var name = radioId.substr(4);	// eliminar # del id

		var img = document.createElement("IMG");
	    img.src = "imgs/alimentos/"+name+".png";
	    img.id = "imgGen2"

	    document.getElementById('imgOpc2').appendChild(img);


	    //modificar tam
	    var imgGen = document.getElementById('imgGen2');
		if(imgGen && imgGen.style) {
		    imgGen.style.height = '60px';
		    imgGen.style.width = '80px';
		}

	} else {
		var imgToRm = document.getElementById('imgGen2');
		imgToRm.parentNode.removeChild(imgToRm);
		verify_second_radio_group(radioId);
	}

}

function verify_third_radio_group(radioId) {

	//verificar si no hay otro imgn
	if (document.getElementById('imgGen3') == null) {
		var name = radioId.substr(4);	// eliminar # del id

		var img = document.createElement("IMG");
	    img.src = "imgs/alimentos/"+name+".png";
	    img.id = "imgGen3"

	    document.getElementById('imgOpc3').appendChild(img);


	    //modificar tam
	    var imgGen = document.getElementById('imgGen3');
		if(imgGen && imgGen.style) {
		    imgGen.style.height = '60px';
		    imgGen.style.width = '80px';
		}

	} else {
		var imgToRm = document.getElementById('imgGen3');
		imgToRm.parentNode.removeChild(imgToRm);
		verify_third_radio_group(radioId);
	}

}

function verify_fourth_radio_group(radioId) {

	//verificar si no hay otro imgn
	if (document.getElementById('imgGen4') == null) {
		var name = radioId.substr(4);	// eliminar # del id

		var img = document.createElement("IMG");
	    img.src = "imgs/alimentos/"+name+".png";
	    img.id = "imgGen4"

	    document.getElementById('imgOpc4').appendChild(img);


	    //modificar tam
	    var imgGen = document.getElementById('imgGen4');
		if(imgGen && imgGen.style) {
		    imgGen.style.height = '60px';
		    imgGen.style.width = '80px';
		}

	} else {
		var imgToRm = document.getElementById('imgGen4');
		imgToRm.parentNode.removeChild(imgToRm);
		verify_fourth_radio_group(radioId);
	}
}

function delete_all_imgs() {
	var imgToRm = document.getElementById('imgGen1');
	imgToRm.parentNode.removeChild(imgToRm);

	var imgToRm = document.getElementById('imgGen2');
	imgToRm.parentNode.removeChild(imgToRm);

	var imgToRm = document.getElementById('imgGen3');
	imgToRm.parentNode.removeChild(imgToRm);

	var imgToRm = document.getElementById('imgGen4');
	imgToRm.parentNode.removeChild(imgToRm);
}


/**********************
  Level 1 functions
***********************/
/**
 * This method generates the purchases from the objects the user choose from
 * the shop.
 *
 * @param {}
 * @return {}
 */
function generatePurchases(){
	var playerPurchases =[];

	if(!isEmptyListGenerated){
		generateEmptyBuyList(shoppingCart);
		isEmptyListGenerated = true;
	}

	// We obtain the id of the selected radio-buttons
	playerPurchases = obtainPurchases();

	// We eliminate the extra element of the id
	playerPurchases = parseShoppingList(playerPurchases);

	/**
	 * We check if theres enough money to buy one of the products that the user
	 * wants
	 */
	if(isMoneyLeft(playerPurchases)){
		makePurchases(playerPurchases);
		var isObjective = isObjectiveComplete(shoppingCart);
		if(isObjective){
			/*alert("GANASTE");
			loadNewLevel(2);*/
			$( "#successfulDialog" ).dialog( "open" );
			close_shop();
			actualLevel++
			//console.log("nivel: "+actualLevel)
			loadNewLevel(actualLevel);
		}
	}else{
		//alert("Perdiste el juego ya no puedes comprar :'( ");
		$( "#failDialog" ).dialog( "open" );
		close_shop();
		actualLevel=1;
		loadNewLevel(actualLevel);
	}
	// We clear the radio-buttons to make new purchases
	clearOptions(playerPurchases);
}


/**********************
  Funciones del nivel 2
***********************/

/**
 * This method generates the purchases from the objects the user choose from
 * the shop.
 *
 * @param {}
 * @return {}
 */
function generatePurchases2() {
	var playerPurchases =[];
	var isValidPurchase = false;

	if(!isEmptyListGenerated){
		generateEmptyBuyList(shoppingCart);
		isEmptyListGenerated = true;
	}

	// We obtain the id of the selected radio-buttons
	playerPurchases = obtainPurchases();

	// We eliminate the extra element of the id
	playerPurchases = parseShoppingList(playerPurchases);

	// Now we obtain the product priority
	var products_priorities = generateAleatoryPriorities(productList);
	var mediumPriority = getMediumPriority(products_priorities);

	/**
	 * We check if theres enough money to buy one of the products that the user
	 * wants
	 */
	if(isMoneyLeft(playerPurchases)){
		makePurchases(playerPurchases);
		var priority = obtenerPrioridad(shoppingCart,products_priorities);
		var isObjective = isObjectiveComplete(shoppingCart);
		if(isObjective || priority >= mediumPriority){
			/*alert("GANASTE");
			loadNewLevel(3);*/
			$( "#successfulDialog" ).dialog( "open" );
			close_shop();
			actualLevel++;
			loadNewLevel(actualLevel);
		}
	}else{
		//alert("Perdiste el juego ya no puedes comprar");
		$( "#failDialog" ).dialog( "open" );
		close_shop();
		actualLevel = 1;
		loadNewLevel(actualLevel);

	}

	// We clear the radio-buttons to make new purchases
	clearOptions(playerPurchases);
}

/**
 * Method to obtain the average priority of the products.
 *
 * @param {items} list of products to buy each with its respective priority
 * @return {medium_priority} required priority to win the game
 */
function getMediumPriority(items) {
	var medium_priority = 0;
	var pdcts_len = items.length;
	for (var i = 0; i < pdcts_len; i++) {
		medium_priority = medium_priority + items[i].priority;
	}
	medium_priority = Math.floor(medium_priority/pdcts_len);
	return medium_priority;
}

/**
 * Method to obtain the acumulated priority based on the user
 * purchases.
 *
 * @param {shoppingCart} list of products to buy
 * @param {product_priorities}  products with priority
 * @return {acumulatedPriority} acumulated priority
 */
function obtenerPrioridad(shoppingCart,product_priorities){
	var acumulatedPriority =0;
	for(var i =0; i< product_priorities.length;i++){
		var product = product_priorities[i].product;
		if(shoppingCart.indexOf(product)!=-1){
			acumulatedPriority += product_priorities[i].priority;
		}
	}
	return acumulatedPriority;
}

/**********************
  Funciones compartidas
	entre niveles.
***********************/

/**
 * This method validates if the user has enough money to buy a product.
 *
 * @param {purchase}
 * @return {isValidPurchase}
 */
function validatePurchases(purchase) {

	var isValidPurchase = false;
	var productPrice = getPriceById(purchase);

	var remainingMoney = availableMoney - productPrice;
	remainingMoney = remainingMoney.toFixed(2);

	if(remainingMoney >=0 ){
		isValidPurchase = true;
	}else{
		isValidPurchase = false;
	}

	return isValidPurchase;
}

/**
 * This method make the purchase of each product in the shopping list
 *
 * @param {playerPurchases}
 * @return {}
 */
function makePurchases(playerPurchases){

	var purchasedProducts = [];
	var notPurchasedProducts = [];

		var ICJ =0;
		for( ICJ = 0; ICJ < playerPurchases.length; ICJ++){
			var id = playerPurchases[ICJ];
			var isValidPurchase = validatePurchases(id);

			if (isValidPurchase) {
				buyProduct(id);
				notPurchasedProducts.push(id);
			}else{
				purchasedProducts.push(id);
			}
		}
		alert("se compraron los products: \n" + notPurchasedProducts);
		alert("no se pudieron comprar los products: \n"+purchasedProducts);
}

/**
 * This Method gets the product price from the list and makes the purchase.
 *
 * @param {id}
 * @return {}
 */
function buyProduct(id){
		//funcion que toma el id y verifica si es importante para la compra
		var isInShopList = isInList(id);
		//funcion que verifica si ya se compro la cantidad deseada de ese id

		var productPrice = getPriceById(id);
		var temp_availableMoney = availableMoney - productPrice;
		temp_availableMoney = temp_availableMoney.toFixed(2);

		if(isInShopList){
			var isGoal = isGoalAchieved(id,shoppingCart);
			if(!isGoal){
				//como no se ha logrado el objetivo se actualiza el precio
				availableMoney = temp_availableMoney;
				updatePrice(availableMoney);
			}else{
				/*
				ya que el objetivo de ese tipo de producto ya se cumplio  se inserta el
				equivalente de ese id de la list de shoppingCart
				*/
				var res = id.split("-");
				for( var i =0; i < shoppingList.length; i++){
					var objective = shoppingList[i];
					var res2 = shoppingList[i].split("-");
					if(res[0] == res2[0]){
						break;
					}
				}
				availableMoney = temp_availableMoney;
				updateData(objective,availableMoney);
			}
		}else{
			//no es necesario realizar esa compra solo se disminuye dinero
			availableMoney = temp_availableMoney;
			updatePrice(availableMoney);
		}
}

/**********************
	Funciones de Validacion
***********************/

/**
 * This mthod validates if there is money to buy at least
 * one of the products the user wants
 *
 * @param {playerPurchases}
 * @return {isValid}
 */
function isMoneyLeft(playerPurchases){
	var isValid = false;

	if(playerPurchases.length != 0){
		for(var i=0; i<playerPurchases.length;i++ ){
				var price = getPriceById(playerPurchases[i]);
				if(price <= availableMoney){
					isValid = true;
				}
		}
	}else{
			isValid = true;
	}
	return isValid;
}

/**
 * This method validates if the purchases made are equal than
 * the ones required.
 *
 * @param {list}
 * @return {result}
 */
function isObjectiveComplete(list){
	var result = true;
	for(var i =0; i < list.length; i++){
		var res = list[i].split("-");
		var res2 = shoppingList[i].split("-");

		var target = parseInt(res[1]);
		var objective = parseInt(res2[1]);

		if( target < objective ){
			result = false;
		}
	}
	return result;
}

/**
 * This method validates if the selected product is in the shopping
 * list.
 *
 * @param {id}
 * @return {result}
 */
function isInList(id){
	var result = false;
	var res2 = id.split("-");

	for(var i =0; i < shoppingList.length; i++){
		var res = shoppingList[i].split("-");
		if (res[0] == res2[0]){
			result = true;
		}
	}

	return result;
}

/**
 * This method validates if the user has meet the required amount of
 * a product.
 * @param {id}
 * @param {list}
 * @return {result}
 */
function isGoalAchieved(id,list){
	var result = false;
	var res = id.split("-");
	for( var i =0; i < shoppingList.length; i++){
		var res2 = shoppingList[i].split("-");
		if(res[0] == res2[0]){
			break;
		}
	}

	for(var i =0; i < list.length; i++){
		var res3 =list[i].split("-");
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

	var index = list.indexOf(list[objectiveIndex]);
	list[index] = res[0] + "-" + (sum).toString();

	return result;
}

/**********************
	Funciones de Middleware
***********************/

/**
 * This method updates the price in the view.
 *
 * @param {availableMoney}
 * @return {}
 */
function updatePrice(availableMoney){
	document.getElementById("money").innerHTML=availableMoney;
}

/**
 * This method updates the shopping list if the user has meet one of the
 * required ammount from a product.

 * @param {id}
 * @param {availableMoney}
 * @return {}
 */
function updateData(id,availableMoney){
	var check = document.getElementById(id);
	if( check.checked != true){
			document.getElementById(id).checked = true;
			updatePrice(availableMoney);
	}
}

/**
 * This method clear the selected radio-buttons.
 *
 * @param {playerPurchases}
 * @return {}
 */
function clearOptions(playerPurchases){
	for( var i = 0; i < playerPurchases.length; i++){
		var id = playerPurchases[i];
		var id = "opt-"+id;
		var check = document.getElementById(id);
		if( check.checked == true){
				document.getElementById(id).checked = false;
		}
	}
}

/**
 * This method eliminates the extra element of the radio-buttons id.
 *
 * @param {originalPurchases}
 * @return {parsedPurchases}
 */
function parseShoppingList(originalPurchases){

	var parsedPurchases =[];
	for(var i =0; i < originalPurchases.length; i++){
		var res = originalPurchases[i].split("-");
		var id = "";
		id = res[1] + "-" + res[2];
		parsedPurchases.push(id);
	}
	return parsedPurchases;
}

/**
 * This method adds a new item to the shopping list view.
 *
 * @param {product}
 * @return {}
 */
function añadirDatos(product){

	var cheq = crearCheckbox(product);
	var label = crearLabel(product,cheq);
	var breakpoint = document.createElement("BR");

	document.getElementById("demo").appendChild(cheq);
	document.getElementById("demo").appendChild(label);
	document.getElementById("demo").appendChild(breakpoint);
}

/**********************
	Funciones de Utilidad
***********************/

/**
 * This method adds the new product to the shopping list.
 *
 * @param {product}
 * @return {}
 */
function añadirItemListaCompras(product) {
	shoppingList.push(product.id);
}

/**
 * We obtain the price of a product using the product id.
 *
 * @param {id} identificador del producto
 * @return {productPrice} precio del producto
 */
function getPriceById(id){
	var iLP = 0; // indice para la productList

	for (iLP = 0; iLP < productList.length; iLP++) {

		var productName = productList[iLP]; // nombre del producto a buscar
		var product = products[productName]; // objeto producto del JSON
		var iP = 0; 							  // indice del objeto producto

		for (iP = 0; iP < product.length; iP++) {
			// si es el id, se regresa el precio del produto
			if ( product[iP].id == id) {
				var productPrice = product[iP].precio;	// precio del producto

				productPrice = productPrice.toFixed(2);
				return productPrice;
			}
		}
	}
}

/**
 * We obtain the id of the selected radio-buttons
 *
 * @param {}
 * @return {playerPurchases}
 */
 var purchases = [];
function obtainPurchases(){
	purchases = [];
	var searchEles = document.getElementById("shop").children;
	obtainData(searchEles);
	return purchases;
}

/**
 * This method parse the div until it founds the radio-buttons.
 *
 * @param {searchEles}
 * @return {}
 */
function obtainData(searchEles){

	for(var i =0; i < searchEles.length; i++){
		if(searchEles[i].tagName == 'DIV'){
			obtainData(searchEles[i].children);
		}
		if(searchEles[i].tagName == 'INPUT'){
			if(searchEles[i].checked == true){
				purchases.push(searchEles[i].id);
			}
		}
	}
}

/**
 * We obtain an aleatory product of the list
 *
 * @param {product}
 * @return {randomProduct}
 */
function getRandomProduct(product){
	var randomProduct = product[Math.floor(Math.random() * product.length)];
	return randomProduct;
}

/**
 * This method adds the price of a product to the ammount of money the user has.
 *
 * @param {product}
 * @return {}
 */
function calculateAmmount(product){
	availableMoney = availableMoney + product.precio;
	productAmount = productAmount + 1;
	return [availableMoney,productAmount];
}

/**
 * This method displays the available money the user has in the view.
 *
 * @param {availableMoney}
 * @return {}
 */
function displayAvailableMoney(availableMoney){

	availableMoney = availableMoney.toFixed(2);			// redondear el total a dos decimales
	var dinero_disponible = document.createElement("LABEL");
	dinero_disponible.id ="money";
	var texto_dinero = document.createTextNode(availableMoney);
	dinero_disponible.appendChild(texto_dinero);
	document.getElementById("total").appendChild(dinero_disponible);
}


/**
 * We obtain a random integer between a range
 * uing Math.round().
 *
 * @param {min}
 * @param {max}
 * @return {randomInteger}
 */
function getRandomInt(min, max) {
	var randomInteger = Math.floor(Math.random() * (max - min)) + min;
	return randomInteger;
}

/**
 * Obtain the available money for the level 2
 *
 * @param {total_purchase}
 * @return {new_total_purchase}
 */
function getAvailableMoneyLv2(total_purchase) {
	var new_total_purchase = total_purchase/2;
	return new_total_purchase;
}

/**
 * This method changes the actual level.
 *
 * @param {id}
 * @return {}
 */
function selectLevel(level){
	var button = document.getElementById("comprarbutton");
	isEmptyListGenerated = false;
	if(level == 1){
		//button.onclick = generatePurchases;
		shoppingCart = [];
	}
	if(level == 2){
		//button.onclick = generatePurchases2
		shoppingCart = [];
	}
	if(level > 2){
		alert("ya no hay mas");
	}
}

/**
 * This method generates an empty list of products, using the shopping
 * list as a reference, the method puts 0 in the index of each product.
 *
 * @param {list}
 * @return {}
 */
function generateEmptyBuyList(list){
	for(var i = 0; i < shoppingList.length;i++){
		var res = shoppingList[i].split("-");
		var zero = 0;
		res = res[0] + "-" +zero.toString();
		list.push(res);
	}
}

/**
 * This method creates an array of products.
 *
 * @param {products}
 * @return {productList}
 */
function createProductArray(products) {
	var productList = [];
	for ( var elemento in products ) {
		productList.push(elemento);
	}
	return productList;
}

/**
 * This method loads the next level parameters.
 *
 * @param {level}
 * @return {}
 */
function loadNewLevel(level){
	clearPrice();
	productList = [];
	shoppingList= [];
	availableMoney = 0.0;
	productAmount = 0;

	productList = createProductArray(products);
	shuffle(productList);
	crearListaProductos(products,availableMoney,productAmount);

	selectLevel(level);
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

/**
 * This method creates the product list.
 *
 * @param {produtcs}
 * @param {availableMoney}
 * @param {productAmount}
 * @return {}
 */
function crearListaProductos(products, availableMoney, productAmount){
	var i,j;
	var element;
	var count;
	var product;			// producto de la list
	var compra_minima = 6;	// cantidad de products minimos en una list

	clearProductList();

	for (j = 0; j < compra_minima; j++ ) {
		product = products[productList[j]];
		flag =1;
		index=0;
		count =0;

		var productoAleatorio = getRandomProduct(product);
		añadirItemListaCompras(productoAleatorio);
		añadirDatos(productoAleatorio);

		valores_totales = calculateAmmount(productoAleatorio);
		availableMoney = valores_totales[0];
		productAmount = valores_totales[1];
	}
	displayAvailableMoney(availableMoney);
}

/**
 * This method generates the priories for the products.
 *
 * @param {items}
 * @return {products_priorities}
 */
function generateAleatoryPriorities(items) {
	var lowest_priority = 0;
	var top_priority = 5;
	var pdcts_len = items.length;
	var products_priorities = items.slice();	// copiar un arreglo por valor

	for (var i = 0; i < pdcts_len; i++) {
		var priority = getRandomInt(lowest_priority,top_priority);
		var product = items[i];
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
	productIndex = 0;
	//delete_all_imgs();
}

function ventana_tienda () {
	var modal = document.getElementById('modalTienda');
	var btn = document.getElementById("BtnIrTienda");
	var span = document.getElementsByClassName("close")[0];

	var door = document.getElementById("door");

	var modalHelp = document.getElementById('modalhelp');
	var helpBtn = document.getElementById("helpBtn");
	var spanHelp = document.getElementsByClassName("close")[1];

	// When the user clicks on the button, open the modal
	btn.onclick = function() {
		loadShopElements(0);
	    modal.style.display = "block";
	}

	door.onclick = function() {
		loadShopElements(0);
			modal.style.display = "block";
	}


	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
			productIndex =0;
	    modal.style.display = "none";
	}

	// When the user clicks on the button, open the modal
	helpBtn.onclick = function() {
	    modalHelp.style.display = "block";
			loadHelpElements();
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

/**
 * This method creates a checkbox.

 * @param {product}
 * @return {checkbox}
 */
function crearCheckbox(product){

	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type","checkbox");
	checkbox.disabled = true;
	checkbox.id = product.id;
	checkbox.name =product.name;

	return checkbox;
}

/**
 * This method creates a label for a checkbox.

 * @param {product}
 * @param {cheq}
 * @return {}
 */
function crearLabel(product,cheq){

	var label = document.createElement("LABEL");
	var text = document.createTextNode(product.name);

	label.setAttribute("for",cheq.id);
	label.appendChild(text);
	return label;
}

/**
 * This method updates the price in the view.
 *
 * @param {}
 * @return {}
 */
function clearPrice(){
	var data = document.getElementById("total");
	for(var i=0; i < data.childNodes.length;i++){
		var child = data.childNodes[i].id;
		if(child != null){
			if ( ( (child).localeCompare("money") ) == 0) {
				var item = document.getElementById("money");
				item.parentNode.removeChild(item);
			}
		}
	}
}

/**
 * This method clears the product list.
 *
 * @param {}
 * @return {}
 */
function clearProductList(){

	var div = document.getElementById("demo");
	var index = div.childNodes.length;
	for(var i = 0; i < index; i++){
		demo.removeChild(div.childNodes[0]);
	}
}


/**********************
	Funciones nuevas control de ventana modal dinamico
***********************/

var shopIndex = 0 ;
var productIndex = 0;

function createShopElements(itemList,itemName){

	var shopDiv = document.getElementById("shop");

	for(var index = 0; index <  itemName.length; index++){
		var mainDiv = document.createElement("DIV");

		var fun;
		switch (index) {
			case 0:
			mainDiv.id = "firstOptions";
				break;
			case 1:
			mainDiv.id = "secondOptions";
			break;

			case 2:
			mainDiv.id = "thirdOptions";
			break;

			case 3:
			mainDiv.id = "fourthOptions";
			break;
		}

		var tittle = document.createElement("LABEL");
		tittle.innerHTML= String(itemName[index]);

		mainDiv.appendChild(tittle);

		var price = document.createElement("LABEL");
		price.id = "price-"+(index+1).toString();
		price.innerHTML = "";
		mainDiv.appendChild(price);

		var br = document.createElement("BR");
		mainDiv.appendChild(br);

		var list = itemList[index];

		for(index2 = 0; index2 < 3; index2++){
			var div = document.createElement("DIV");
			var clas ="option"+(index2+1).toString();
			div.setAttribute("class",clas ) ;
			var input = document.createElement("INPUT");
			var id = "opt-"+list[index2].id;
			input.id = id;
			input.name = itemName[index];
			input.setAttribute("type","radio");
			input.onclick = verify_radio_group;

			//input.value=""
			var label = document.createElement("LABEL");
			label.setAttribute("for",list[index2].id);
			label.innerHTML = list[index2].amount;
			div.appendChild(input);
			div.appendChild(label);
			mainDiv.appendChild(div);
		}

		//create ImageDiv

		var imgDiv = document.createElement("DIV");
		imgDiv.id ="option" + (index+1).toString() +"-selected";
		var imgContainer = document.createElement("DIV");
		imgContainer.id = "imgOpc"+(index+1).toString();
		imgDiv.appendChild(imgContainer);

		shopDiv.appendChild(mainDiv);
		shopDiv.appendChild(imgDiv);
	}
	var prdiv = document.createElement("DIV");
	prdiv.id="products-set";
	var nextarr = document.createElement("BUTTON");
	nextarr.id = "next-arrow";
	nextarr.onclick = loadNextElements;
	var prevarr = document.createElement("BUTTON");
	prevarr.id = "prev-arrow";
	prevarr.onclick = loadPreviousElements;
	prdiv.appendChild(nextarr);
	prdiv.appendChild(prevarr);


	var button = document.createElement("BUTTON");
	button.id = "comprarbutton";
	button.innerHTML = "COMPRAR";

	switch(actualLevel){
		case 1:
		button.onclick = generatePurchases;
		break;

		case 2:
		button.onclick = generatePurchases2;
		break;

		case 3:
		//button.onclick = generatePurchases3(this);
		break;
	}
	shopDiv.appendChild(prdiv);
	var comprdiv = document.createElement("DIV");
	comprdiv.id = "comprar-div";
	comprdiv.appendChild(button);
	shopDiv.appendChild(comprdiv);

	//console.log(shopDiv);

}

function loadPreviousElements(){
	loadShopElements(1);
}

function loadNextElements(){
	loadShopElements(0);
}

function loadShopElements(dir){

	var list = []
	var itemList = [];
	var itemName = [];
	var next = 0;
	clearShopElements();

	while(shopIndex < 4){

		if(productIndex < 0 && dir != next){
			productIndex = 11;
		}
		if(productIndex > 11 && dir == next){
			productIndex = 0;
		}

		var productName = productList_Ordered[productIndex];
		itemName.push(productName);
		//console.log(productName);
		var productType = products[productName];

		list = [];
		for(var index = 0; index < productType.length; index++){
			list.push(productType[index]);
		}
		itemList.push(list)
		shopIndex++;
		if(dir == next){
			productIndex++;
		}else{
			productIndex--;
		}

	}
	//console.log(itemList);

	createShopElements(itemList,itemName);
	getIdbyGroupName(itemName);
	shopIndex = 0;

}


function clearShopElements(){

	var shop = document.getElementById("shop");
	while (shop.hasChildNodes()) {
        shop.removeChild(shop.childNodes[0]);
    }
}


function verify_radio_group(){
	var selectedItems = obtainPurchases();
	for(var index = 0; index < selectedItems.length; index ++){
		var selected = selectedItems[index]
		var id = splitId(selected);

		//console.log("el id de entrada es: "+ id);


		if( (id.localeCompare(itemId[0]) ) == 0 ){
			verify_first_radio_group(selected)
			verify_price(selected,1);
		}

		if( (id.localeCompare(itemId[1]) ) == 0 ){
			verify_second_radio_group(selected);
			verify_price(selected,2);

		}

		if( (id.localeCompare(itemId[2]) ) == 0 ){
			verify_third_radio_group(selected);
			verify_price(selected,3);

		}

		if( (id.localeCompare(itemId[3]) ) == 0 ){
			verify_fourth_radio_group(selected);
			verify_price(selected,4);

		}


	}

}

function verify_price(selected,index){
	var name = selected.substr(4);
	var price = getPriceById(name);
	var id = "price-"+index;
	var priceTag  = document.getElementById(id);
	priceTag.innerHTML=" $"+ price;
}

function splitId(id){
	//el id llega de tipo opt-id-num
	//el objetivo es usar el split con del="-"
	var res = id.split("-");
	return res[1];
}

var itemId = [];
function getIdbyGroupName(itemName){
	itemId = [];

	for(index = 0; index < itemName.length; index++){
		var item = itemName[index];

		switch (item) {
			case "pescado":
				itemId.push("psc");
				break;
			case "pollo":
				itemId.push("pol");
			break;
			case "atun":
				itemId.push("atn");
			break;
			case "sardina":
				itemId.push("sdn");
			break;
			case "frijol":
				itemId.push("frj");
			break;
			case "arroz":
				itemId.push("arz");
			break;
			case "azucar":
				itemId.push("azu");
			break;
			case "galleta":
				itemId.push("gal");
			break;
			case "jugo":
				itemId.push("jug");
			break;
			case "leche":
				itemId.push("lec");
			break;
			case "pan":
				itemId.push("pan");
			break;
			case "sandia":
				itemId.push("san");
			break;
		}
	}
}


function loadHelpElements(){

	var help = document.getElementById("helpInfo");

	var div = document.createElement("DIV");

	var p1 = document.createElement("P");
	p1.id ="hip1";
	p1.innerHTML = "* Seleccionar un objeto a comprar (1 jugo, 2 jugos, 1 pan, etc.)";

	var p2 = document.createElement("P");
	p2.id = "hip2";
	p2.innerHTML = "* Verificar mediante la imagen";
	var img2 = document.createElement("IMG");
	img2.id = "hip2Img";
	img2.src = "imgs/linr_products.png";
	p2.appendChild(img2);

	var p3 = document.createElement("P");
	p3.id = "hip3";
	p3.innerHTML = "* Repetir por cada opción de artículos";
	img3 = document.createElement("IMG");
	img3.id = "hip3Img";
	img3.src = "imgs/some_products.png";
	p3.appendChild(img3);

	var p4 = document.createElement("P");
	p4.id = "hip4";
	p4.innerHTML = "* Al terminar, seleccionar el botón comprar";
	img4 = document.createElement("IMG");
	img4.id = "hip4Img";
	img4.src = "imgs/bot_com.png";
	p4.appendChild(img4);

	if(actualLevel == 1){
		div.id = "helplvl1";
		help.innerHTML="_____________________ <br>REGLAS DEL NIVEL 1: <br>_____________________";

	}

	if(actualLevel == 2){
		div.id = "helplvl2";
		help.innerHTML="_____________________ <br>REGLAS DEL NIVEL 2: <br>_____________________";

	}

	div.appendChild(p1);
	div.appendChild(p2);
	div.appendChild(p3);
	div.appendChild(p4);
	help.appendChild(div);
}

function clearHelpElements(){

	var help = document.getElementById("helpInfo");
	while (help.hasChildNodes()) {
        help.removeChild(help.childNodes[0]);
    }
}

var isAudioPaused = false;
function soundControl(){
	if(isAudioPaused){
		isAudioPaused = false;
		loadSong(isAudioPaused);
	}else{
		isAudioPaused = true;
		loadSong(isAudioPaused);
	}
}
