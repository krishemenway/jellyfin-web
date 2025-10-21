import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { useGlobalStyles, useCalculatedBreakpoint } from "AppStyles";
import { ResetModalOnLocationChange } from "Common/Modal";
import { useObservable } from "@residualeffect/rereactor";
import { ThemeService } from "Users/ThemeService";
import { ErrorBoundary } from "react-error-boundary";

import { NotFound } from "Common/NotFound";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemListView } from "ItemList/ItemListView";

import { ServerDashboard } from "ServerAdmin/ServerDashboard";
import { MetadataEditor } from "ServerAdmin/MetadataEditor";
import { Icons } from "ServerAdmin/Icons";

import { Home } from "Home/Home";
import { Person } from "People/Person";

import { Settings } from "Users/Settings";
import { RequireServerAndUser } from "Users/RequireServerAndUser";

import { Show } from "Shows/Show";
import { Movie } from "Movies/Movie";
import { MusicAlbum } from "Music/MusicAlbum";
import { PhotoAlbum } from "Photos/PhotoAlbum";
import { MusicArtist } from "Music/MusicArtist";
import { Collection } from "Collections/Collection";

import { Studio } from "Studios/Studio";
import { Studios } from "Studios/Studios";

import { Tag } from "Tags/Tag";
import { Tags } from "Tags/Tags";

import { Genre } from "Genres/Genre";
import { Genres } from "Genres/Genres";

const Layout: React.FC = () => {
	const [breakpoint, ResponsiveProvider] = useCalculatedBreakpoint();

	return (
		<ResponsiveProvider value={breakpoint}>
			<RequireServerAndUser>
				<ErrorBoundary fallback={<LoadingErrorMessages errorTextKeys={["UnknownError"]} />}><Outlet /></ErrorBoundary>
			</RequireServerAndUser>

			<ResetModalOnLocationChange />
		</ResponsiveProvider>
	);
}

const App: React.FC<{ basePath: string }> = (props) => {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	React.useEffect(() => { ThemeService.Instance.ApplyThemeToCssVariables(theme); }, [theme]);

	useGlobalStyles();

	return (
		<RouterProvider
			router={createBrowserRouter([
				{
					path: "/",
					element: <Layout />,
					errorElement: <LoadingErrorMessages errorTextKeys={["UnknownError"]}/>,
					children: [
						{ path: "/Settings", element: <Settings /> },

						{ path: "/Person/:personId", element: <Person /> },

						{ path: "/Shows/:libraryId/:optionsName", element: <ItemListView itemKind="Series" paramName="libraryId" /> },
						{ path: "/Shows/:libraryId", element: <ItemListView itemKind="Series" paramName="libraryId" /> },
						{ path: "/Show/:showId", element: <Show /> },
						{ path: "/Show/:showId/Season/:seasonId", element: <Show /> },
						{ path: "/Show/:showId/Episode/:episodeId", element: <Show /> },

						{ path: "/Music/Album/:albumId", element: <MusicAlbum /> },
						{ path: "/Music/Artist/:artistId", element: <MusicArtist /> },

						{ path: "/Music/Songs/:libraryId/:optionsName", element: <ItemListView itemKind="Audio" paramName="libraryId" /> },
						{ path: "/Music/Songs/:libraryId", element: <ItemListView itemKind="Audio" paramName="libraryId" /> },
						{ path: "/Music/Albums/:libraryId/:optionsName", element: <ItemListView itemKind="MusicAlbum" paramName="libraryId" /> },
						{ path: "/Music/Albums/:libraryId", element: <ItemListView itemKind="MusicAlbum" paramName="libraryId" /> },
						{ path: "/Music/Artists/:libraryId/:optionsName", element: <ItemListView itemKind="MusicArtist" paramName="libraryId" /> },
						{ path: "/Music/Artists/:libraryId", element: <ItemListView itemKind="MusicArtist" paramName="libraryId" /> },

						{ path: "/Photo/Albums/:libraryId/:optionsName", element: <ItemListView itemKind="PhotoAlbum" paramName="libraryId" /> },
						{ path: "/Photo/Albums/:libraryId", element: <ItemListView itemKind="PhotoAlbum" paramName="libraryId" /> },
						{ path: "/Photo/Album/:albumId", element: <PhotoAlbum /> },

						{ path: "/Movies/:libraryId/:optionsName", element: <ItemListView itemKind="Movie" paramName="libraryId" /> },
						{ path: "/Movies/:libraryId", element: <ItemListView itemKind="Movie" paramName="libraryId" /> },
						{ path: "/Movie/:movieId", element: <Movie /> },

						{ path: "/Studios", element: <Studios /> },
						{ path: "/Studio/:studioId", element: <Studio /> },

						{ path: "/Collections/:collectionsId/:optionsName", element: <ItemListView itemKind="BoxSet" paramName="collectionsId" /> },
						{ path: "/Collections/:collectionsId", element: <ItemListView itemKind="BoxSet" paramName="collectionsId" /> },
						{ path: "/Collection/:collectionId", element: <Collection /> },

						{ path: "/Tags/:tag", element: <Tag /> },
						{ path: "/Tags", element: <Tags /> },

						{ path: "/Genres/:genre", element: <Genre /> },
						{ path: "/Genres", element: <Genres /> },

						{ path: "/Dashboard", element: <ServerDashboard /> },
						{ path: "/Metadata", element: <MetadataEditor /> },
						{ path: "/Icons", element: <Icons /> },

						{ index: true, element: <Home /> },
					]
				},
				{ path: "*", element: <NotFound /> },
			], { basename: props.basePath })}
		/>
	);
};

 /* Pass in the DOM element to render inside of into the initialize function and watch react do it's thing. */
declare global { interface Window { initialize?: (element: Element, basePath: string) => void; } }
window.initialize = window.initialize ?? ((element, basePath) => { createRoot(element).render(<App basePath={basePath} />); document.body.className = "jellyfin-base"; });
