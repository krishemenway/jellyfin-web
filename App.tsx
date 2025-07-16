import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { useGlobalStyles } from "Common/AppStyles";
import { ResetModalOnLocationChange } from "Common/Modal";
import { useObservable } from "@residualeffect/rereactor";
import { ThemeService } from "Users/ThemeService";

import NotFound from "Common/NotFound";
import LoadingErrorMessages from "Common/LoadingErrorMessages";

import ServerDashboard from "ServerDashboard/ServerDashboard";
import MetadataEditor from "ServerDashboard/MetadataEditor";

import Home from "Home/Home";
import Person from "People/Person";

import Settings from "Users/Settings";
import RequireServerAndUser from "Users/RequireServerAndUser";

import Shows from "Shows/Shows";
import Show from "Shows/Show";

import Movie from "Movies/Movie";
import Movies from "Movies/Movies";

import MusicAlbum from "Music/MusicAlbum";
import MusicAlbums from "Music/MusicAlbums";

import PhotoAlbum from "PhotoAlbum/PhotoAlbum";
import PhotoAlbums from "PhotoAlbum/PhotoAlbums";

import MusicArtist from "Music/Artist";
import MusicArtists from "Music/Artists";

import Collection from "Collections/Collection";
import Collections from "Collections/Collections";

import Tag from "Tags/Tag";
import Tags from "Tags/Tags";

import Genre from "Genres/Genre";
import Genres from "Genres/Genres";

const App: React.FC = () => {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	React.useEffect(() => { ThemeService.Instance.ApplyThemeToCssVariables(theme); }, [theme]);

	useGlobalStyles();

	return (
		<RouterProvider
			router={createBrowserRouter([
				{
					path: "/",
					element: (
						<>
							<RequireServerAndUser>
								<Outlet />
							</RequireServerAndUser>

							<ResetModalOnLocationChange />
						</>
					),
					errorElement: <LoadingErrorMessages errorTextKeys={["UnknownError"]}/>,
					children: [
						{ path: "/Settings", element: <Settings /> },

						{ path: "/Person/:personId", element: <Person /> },

						{ path: "/Show/:showId", element: <Show /> },
						{ path: "/Show/:showId/Season/:seasonId", element: <Show /> },
						{ path: "/Show/:showId/Episode/:episodeId", element: <Show /> },
						{ path: "/Shows/:libraryId", element: <Shows /> },

						{ path: "/Music/Albums/:libraryId", element: <MusicAlbums /> },
						{ path: "/Music/Album/:albumId", element: <MusicAlbum /> },
						{ path: "/Music/:libraryId", element: <MusicAlbums /> },

						{ path: "/Music/Artist/:artistId", element: <MusicArtist /> },
						{ path: "/Music/Artists/:libraryId", element: <MusicArtists /> },

						{ path: "/Photo/Albums/:libraryId", element: <PhotoAlbums /> },
						{ path: "/Photo/Album/:albumId", element: <PhotoAlbum /> },

						{ path: "/Movies/:libraryId", element: <Movies /> },
						{ path: "/Movie/:movieId", element: <Movie /> },

						{ path: "/Collections", element: <Collections /> },
						{ path: "/Collection/:collectionId", element: <Collection /> },

						{ path: "/Tags/:tag", element: <Tag /> },
						{ path: "/Tags", element: <Tags /> },

						{ path: "/Genres/:genre", element: <Genre /> },
						{ path: "/Genres", element: <Genres /> },

						{ path: "/Dashboard", element: <ServerDashboard /> },
						{ path: "/Metadata", element: <MetadataEditor /> },

						{ index: true, element: <Home /> },
					]
				},
				{ path: "*", element: <NotFound /> },
			])}
		/>
	);
};

(window as any).initialize = (element: Element) => {
	createRoot(element).render(<App />);
};
