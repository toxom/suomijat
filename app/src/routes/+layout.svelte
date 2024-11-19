<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { fly, fade, slide } from 'svelte/transition';
    import { X, Calculator, Camera, Bell, MapPin, CircleX, LogIn, User, LogOut, MessageCircle, Filter, FilterX } from 'lucide-svelte';
    import Notifications from '$lib/overlays/NotificationsOverlay.svelte';
    import Profile from '$lib/overlays/ProfileOverlay.svelte';
    import { currentUser } from '$lib/pocketbase';
    import Auth from '$lib/overlays/Auth.svelte'
	import Landing from '$lib/content/landing.svelte'

    import { goto } from '$app/navigation';


    let activeLink = '/'; 
    let overlayState = {
        notifications: false,
        reports: false,
        navigator: false,
        auth: false 
    };

    let showAuth = false;
    let showProfile = false;

    function toggleAuthOrProfile() {
        if ($currentUser) {
            showProfile = !showProfile;
            showAuth = false;
        } else {
            showAuth = !showAuth;
            showProfile = false;
        }
    }

 function handleAuthSuccess() {
        showAuth = false;
        // You might want to fetch the business account here if it exists
    }

    function handleLogout() {
        showProfile = false;
        showAuth = false;
        goto('/');
    }

    function setActiveLink(path: string) {
        activeLink = path;
    }




    function toggleOverlay(overlayName: keyof typeof overlayState) {
        if (overlayName === 'notifications') {
            overlayState.notifications = !overlayState.notifications;
        } else {
            overlayState = {
                notifications: overlayState.notifications, 
                
                [overlayName]: !overlayState[overlayName]
            };
        }
        activeLink = overlayName;
    }
    
    function handleOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            showAuth = false;
            showProfile = false;
        }
    }

</script>
<!-- <img src={Muse} alt="Landing illustration" class="illustration" /> -->

<div class="container">

	<header>

        <h1>
            Suomijat
        </h1>

        <!-- <button class="toggle-filter" on:click={() => showFilterSelector = !showFilterSelector}>
            {#if showFilterSelector}
                <FilterX size={20} />
                Hide
            {:else}
                <Filter size={20} />
                Filters

            {/if}
        </button> -->
        <!-- <div class="search-bar">
            <input type="text" placeholder="Search...">
        </div> -->
        <div class="nav-links" transition:fly={{ y: 50, duration: 300 }}>
            <button class="nav-link" class:active={activeLink === 'notifications'} on:click={() => toggleOverlay('notifications')}>
                <Bell size={20} />
                Notifications
            </button>



            <button class="nav-link" on:click={toggleAuthOrProfile} transition:fly={{ y: -200, duration: 300}}>
                {#if $currentUser}
                        <span class="user-name">{$currentUser.name || $currentUser.email}</span>
                        <div class="avatar-container">
                            {#if $currentUser.avatar}
                                <img src={pb.getFileUrl($currentUser, $currentUser.avatar)} alt="User avatar" class="avatar" />
                            {:else}
                                <div class="avatar-placeholder">
                                    <Camera size={24} />
                                </div>
                            {/if}
                        </div>
                    
                {:else}
                    <LogIn size={24} />
                    <span>Login</span>
                {/if}
            </button>


        </div>

    </header>
	<Landing/>


    {#if showAuth}
    <div class="auth-overlay" on:click={handleOverlayClick}  transition:fly={{ y: -200, duration: 300}} >
        <div class="auth-content" transition:fly={{y: 200, duration: 300}}>
            <button class="close-button" transition:fly={{ y: -200, duration: 300}} on:click={() => showAuth = false}>
                <X size={24} />
            </button>
            <Auth on:success={handleAuthSuccess} on:logout={handleLogout} />
        </div>
    </div>
    {/if}
    {#if showProfile}
    <div class="profile-overlay" on:click={handleOverlayClick} transition:fly={{ y: -200, duration: 300 }}>
        <div class="profile-content" transition:fly={{ y: -200, duration: 300 }}>
            <button class="close-button" on:click={() => showProfile = false}>
                <X size={24} />
            </button>
            <Profile 
                user={$currentUser} 
                userId={$currentUser ? $currentUser.id : null} 
                onClose={() => showProfile = false} 
                on:logout={handleLogout} 
            />
        </div>
    </div>
    {/if}

        <div class="overlays-container" class:notifications-open={overlayState.notifications}>
            {#each Object.entries(overlayState) as [overlayName, isVisible]}
                {#if isVisible && overlayName !== 'notifications'}
                    <div class="overlay" on:click|self={() => toggleOverlay(overlayName)}>
                        
                    </div>
                {/if}
            {/each}
        </div>
    <main>

        <slot />
        {#if overlayState.notifications}
        <div class="messages-sidenav" transition:fly={{ x: 50, duration: 300 }}>
            <Notifications />
            <button class="close-button" on:click={() => toggleOverlay('notifications')}>
                <CircleX size={20} />
            </button>
        </div>
        {/if}



    </main>
	<footer>
	</footer>
  </div>







  <style>
    /* :global(.loading-spinner) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    } */

    *  {
        background-color: rgb(41, 41, 41);

    }

    main {
      background-color: rgb(41, 41, 41);

    }
	.container {
	  display: flex;
	  flex-direction: column;
      position: absolute;
      /* top: 1%; */
      left: 0;
      right: 0;

      width: 100%;
      /* top: 60px; */
	  /* justify-content: center; */
	  /* align-items: center; */
	  overflow: hidden;
	  /* height: 100vh; */
      
      /* background-color: rgb(41, 41, 41); */

	}

    .auth-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px); /* For Safari support */
        display: flex;
        justify-content: center;
        align-items: center;
        
        z-index: 1000;
    }


    .auth-content {
        position: fixed;
		top: 0;
        /* background-color: #2b2a2a; */
        /* padding: 2rem; */
        width: 100%;
        /* max-width: 500px; */
        height: auto;
        overflow-y: auto;
        border-bottom-left-radius: 150%;
        border-bottom-right-radius: 150%;
    }

    
    header {
	  display: flex;
	  flex-direction: row;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      justify-content: space-between;
	  align-items: center;
      height:3.5%;
      border-bottom-left-radius: 0px; 
	  border-bottom-right-radius: 0px;
	  border-top-left-radius: 8px;
	  border-top-right-radius: 8px;
	  transition: all 0.3s ease;
      user-select: none;
      background-color: rgb(41, 41, 41);
      /* z-index: 2000; */

	}

    .illustration {
            position: absolute;
            width: 60%;
            height: auto;
            left: 20%;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.025;
            z-index: 1;
            pointer-events: none;
        }

	.nav-links {
        /* padding: 20px; */
		display: flex;
		gap: 20px;
		align-items: center;
		justify-content: center;
	}

	.nav-link {
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
        background-color: white;
        /* color: black; */
        border-radius: 10px;
        padding: 5px 10px;
        text-decoration: none;
        font-size: 16px;
        transition: all 0.3s ease;
        border: 2px solid transparent;  /* Add this line */
    }

    .nav-link:hover {
        background-color: rgba(0, 0, 0, 0.05);  /* Changed this for better contrast */
        transform: translateY(-2px);
        color: white;
    }

    .nav-link.active {
        background-color: #e6f7ff;  /* Light blue background */
        color: #1890ff;  /* Blue text */
        border-color: #1890ff;  /* Blue border */
        font-weight: bold;
    }

    footer {
	  color: white;
	  text-align: center;
	  justify-content: center;
	  align-items: center;
	  /* padding: 1rem; */
	  width: 100%;
	  position: fixed;
	  bottom: 0;
	  height: 0;
	}

    .overlays-container {
        position: fixed;
        top: 54px;
        left: 0;
        right: 0;
        /* bottom: 0; */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        transition: right 300ms ease;
    }

    .overlays-container.messages-open {
        right: 300px; /* Width of the messages sidenav */
    }

    .messages-sidenav {
        position: fixed;
        top: 72px; /* Adjust based on your new header height */
        right: 0;
        bottom: 0;
        width: 300px;
        background-color: #ffffff;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        /* z-index: 1001; */
        overflow-y: auto;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(41, 41, 41);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        height: 98%;
        width: 98%;
        /* padding: 20px; */
        /* border: 1px solid rgb(35, 35, 35); */
        border-radius: 50px;
        overflow: auto;
    }

    .sidenav {
        position: fixed;
        top: 60px; /* Adjust based on your new header height */
        right: 0;
        bottom: 0;
        box-shadow: -2px 0 5px rgba(219, 7, 7, 0.1);
        /* z-index: 1001; */
        overflow-y: auto;
    }

    .close-button {
        position: absolute;
        color: red;
        border-radius: 50%;
        top: 10px;
        right: 10px;
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    /* .search-bar {
        flex-grow: 1;
        max-width: 700px;
        margin: 0 20px;
    }

    .search-bar input {
        width: 100%;
        padding: 8px;
        border-radius: 20px;
        border: 1px solid #ccc;
        font-size: 16px;
    } */

    .toggle-filter {
        /* position: fixed; */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100px;
        border: 1px solid black;
        border-radius: 10px;
        left: 1rem; /* Example of changing the position to the right */
        top: 1rem;
        z-index: 30; /* Ensure it stays on top of the filter overlay and shortcuts */
        background-color: rgb(255, 255, 255); /* Add a background color if necessary to make it stand out */
        padding: 0.5rem; /* Optional padding for better visual clarity */
        cursor: pointer;
    }

    .filter-overlay {
        position: fixed;
        left: 0;
        top: 60px;
        bottom: 0;
        width: 250px;
        background-color: white;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        /* z-index: 20; */
    }

    header h1 {
        font-size: 30px;
        margin-left: 2rem;
		color: white;

    }

    .user-name {
        /* max-width: 150px; */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .avatar-container {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
        /* margin-right: 10px; */
    }

    .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #444;
        color: #fff;
    }

    span {
        background-color: transparent;
    }
/* 
	.close-button {
        position: fixed;
        top: 10px;
        left: 10px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }
  */

  </style>