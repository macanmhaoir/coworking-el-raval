;(function () {
	
	'use strict';

	//auth stuff
	auth0.createAuth0Client({
		domain: "coworking-el-raval.eu.auth0.com",
		clientId: "RIvMvuajgBdGr0HADp2PWq9xZuTGZO12",
		authorizationParams: {
			redirect_uri: window.location.origin
		}
	}).then(async (auth0Client) => {
		// Assumes a button with id "login" in the DOM
		const loginButton = document.getElementById("login");

		loginButton.addEventListener("click", (e) => {
			e.preventDefault();
			auth0Client.loginWithRedirect();
		});

		document.getElementById("logout").style.display = "none"; //added
	
		if (location.search.includes("state=") &&
			(location.search.includes("code=") ||
				location.search.includes("error="))) {
			await auth0Client.handleRedirectCallback();
			window.history.replaceState({}, document.title, "/");
		}

		// Assumes a button with id "logout" in the DOM
		const logoutButton = document.getElementById("logout");

		logoutButton.addEventListener("click", (e) => {
			e.preventDefault();
			auth0Client.logout();
		});

		const isAuthenticated = await auth0Client.isAuthenticated();
		const userProfile = await auth0Client.getUser();

		// Assumes an element with id "profile" in the DOM
		const profileElement = document.getElementById("profile");

		if (isAuthenticated) {
			document.getElementById("secret-content").classList.remove("hidden")
			document.getElementById(
				"ipt-access-token"
			).innerHTML = await auth0.getTokenSilently()
			document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(
				await auth0.getUser()
			)
			document.getElementById("logout").style.display = "block"; //added
			document.getElementById("login").style.display = "none"; //added
			profileElement.style.display = "block";
			profileElement.innerHTML = `
            <p>${userProfile.name}</p>
            <img src="${userProfile.picture}" />
          `;
		} else {
			document.getElementById("secret-content").classList.add("hidden")
			profileElement.style.display = "none";
			document.getElementById("login").style.display = "block"; //added
			document.getElementById("logout").style.display = "none"; //added
		}
	});

	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};



	// Burger Menu
	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){

			event.preventDefault();

			if ( $('#navbar').is(':visible') ) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');	
			}

		});

	};


	// Page Nav
	var clickMenu = function() {

		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-fh5co-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};

	// Window Scroll
	var windowScroll = function() {
		var lastScrollTop = 0;

		$(window).scroll(function(event){

		   	var header = $('#fh5co-header'),
				scrlTop = $(this).scrollTop();

			if ( scrlTop > 500 && scrlTop <= 2000 ) {
				header.addClass('navbar-fixed-top fh5co-animated slideInDown');
			} else if ( scrlTop <= 500) {
				if ( header.hasClass('navbar-fixed-top') ) {
					header.addClass('navbar-fixed-top fh5co-animated slideOutUp');
					setTimeout(function(){
						header.removeClass('navbar-fixed-top fh5co-animated slideInDown slideOutUp');
					}, 100 );
				}
			} 
			
		});
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var counterWayPoint = function() {
		if ($('#fh5co-counter-section').length > 0 ) {
			$('#fh5co-counter-section').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};

	// Document on load.
	$(function(){

		parallax();
		burgerMenu();
		clickMenu();
		windowScroll();
		navigationSection();
		counterWayPoint();
		contentWayPoint();

	});


}());