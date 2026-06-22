import { useState, useEffect } from "react";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
};

const statusConfig = {
  aired: {
    label: "Fully aired",
    icon: "ti-circle-check",
    badge: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20",
    pill: "bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20",
  },
  airing: {
    label: "Currently airing",
    icon: "ti-player-play",
    badge: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20",
    pill: "bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20",
  },
  not_aired: {
    label: "Not yet aired",
    icon: "ti-clock",
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
    pill: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  },
  unknown: {
    label: "Unknown",
    icon: "ti-help-circle",
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800",
    pill: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800",
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.badge}`}>
      <i className={`ti ${cfg.icon}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/30 rounded-lg p-3">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}

function ResultCard({ result, watchlist, onToggleWatchlist }) {
  const [expandedSeason, setExpandedSeason] = useState(null);

  const totalEpisodesSum = result.seasons
    ? result.seasons.reduce((acc, s) => acc + s.episodeCount, 0)
    : 0;

  const isTracked = watchlist.some((item) => item.id === result.id);

  const toggleSeason = (seasonNum) => {
    setExpandedSeason(expandedSeason === seasonNum ? null : seasonNum);
  };

  return (
    <div className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm animate-fadeIn">
      {/* Cinematic Banner & Poster Area */}
      <div className="relative">
        {result.backdrop ? (
          <div className="h-32 w-full overflow-hidden bg-slate-950/20 relative">
            <img src={result.backdrop} className="w-full h-full object-cover blur-md scale-110 opacity-40 dark:opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900" />
          </div>
        ) : (
          <div className="h-16 w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        )}

        <div className="flex gap-4 p-5 -mt-10 relative z-10 items-end">
          {result.image ? (
            <img src={result.image} alt={result.title} className="w-20 md:w-28 rounded-xl shadow-lg border-2 border-white dark:border-slate-900 bg-slate-900/10" />
          ) : (
            <div className="w-20 md:w-28 aspect-[2/3] rounded-xl bg-slate-200 dark:bg-slate-850 flex items-center justify-center border-2 border-white dark:border-slate-900">
              <i className="ti ti-photo text-2xl text-slate-400" />
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">{result.type}</span>
              {result.rating && (
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                  <i className="ti ti-star-filled" /> {result.rating}
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">{result.title}</h2>
            <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{result.season}</span>
          </div>

          <button
            onClick={() => onToggleWatchlist(result)}
            className={`p-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
              isTracked
                ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/30"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
            title={isTracked ? "Remove from watchlist" : "Add to watchlist"}
          >
            <i className={`ti ${isTracked ? "ti-heart-filled" : "ti-heart"} text-base`} />
          </button>
        </div>
      </div>

      {result.genres && result.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-1">
          {result.genres.map(genre => (
            <span key={genre} className="text-[10px] md:text-xs bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/10">
              {genre}
            </span>
          ))}
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{result.summary}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatCard label="Total episodes" value={result.totalEpisodes} />
          <StatCard
            label="Last aired ep."
            value={result.lastEpisodeAired != null ? `Ep. ${result.lastEpisodeAired}` : null}
          />
          <StatCard label="Last air date" value={result.lastAirDate} />
          <StatCard label="Next episode" value={result.nextEpisodeDate} />
        </div>

        {result.source && (
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1">
            <i className="ti ti-database" aria-hidden="true" />
            Source: {result.source}
          </p>
        )}
      </div>

      {result.seasons && result.seasons.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Season Breakdown</h3>
            <span className="text-[10px] text-indigo-550 dark:text-indigo-400 italic">Click a season to see episodes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {result.seasons.map((s) => (
              <button
                key={s.number}
                onClick={() => toggleSeason(s.number)}
                className={`border rounded-lg p-3.5 flex flex-col gap-0.5 transition-all text-left w-full relative cursor-pointer ${
                  expandedSeason === s.number
                    ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 ring-1 ring-indigo-500/20"
                    : "border-slate-200/50 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-800/40 hover:border-indigo-500/30"
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Season {s.number}</span>
                  <span 
                    className={`w-2 h-2 rounded-full shrink-0 ${s.aired ? "bg-green-500" : "bg-blue-500 animate-pulse"}`} 
                    title={s.aired ? "Fully Aired" : "Airing / Upcoming"}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 w-full mt-0.5">
                  <span>{s.episodeCount} episodes</span>
                  <i className={`ti ${expandedSeason === s.number ? "ti-chevron-up" : "ti-chevron-down"}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Episode List Accordion */}
          {expandedSeason !== null && (() => {
            const activeSeason = result.seasons.find(s => s.number === expandedSeason);
            if (!activeSeason) return null;
            return (
              <div className="mt-1 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/60 rounded-xl p-4 animate-fadeIn">
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Season {expandedSeason} Episode List</h4>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {activeSeason.episodes.map(ep => (
                    <div key={ep.id} className="flex items-center justify-between gap-3 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/40 rounded-lg p-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0 flex items-center justify-center">
                          {ep.aired ? (
                            <i className="ti ti-circle-check text-green-500 text-base" title="Aired" />
                          ) : (
                            <i className="ti ti-clock text-amber-500 text-base" title="Upcoming" />
                          )}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 shrink-0">Ep. {ep.number || "?"}</span>
                        <span className="text-slate-700 dark:text-slate-355 truncate">{ep.name || "TBA"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                        {ep.airdate ? new Date(ep.airdate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "TBA"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Summary</span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/30">
              {result.seasons.length} Seasons • {totalEpisodesSum} Episodes {result.averageRuntime ? `• ${result.averageRuntime} min avg` : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryPill({ item, onClick }) {
  const cfg = statusConfig[item.status] || statusConfig.unknown;
  return (
    <button className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs border transition-opacity duration-150 cursor-pointer ${cfg.pill}`} onClick={onClick}>
      <i className={`ti ${cfg.icon}`} aria-hidden="true" />
      {item.title}
    </button>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingText, setLoadingText] = useState("Searching database...");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTrackShow = (show) => {
    setWatchlist(prev => {
      const exists = prev.some(item => item.id === show.id);
      let updated;
      if (exists) {
        updated = prev.filter(item => item.id !== show.id);
      } else {
        updated = [...prev, { id: show.id, title: show.title, type: show.type, image: show.image, status: show.status }];
      }
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  async function checkShow(showName) {
    if (!showName.trim()) return;
    setStatus(STATUS.LOADING);
    setResult(null);
    setError("");
    setLoadingText("Searching database...");

    const timer = setTimeout(() => setLoadingText("Finding episode info..."), 1500);

    try {
      let data = null;
      
      const singleSearchUrl = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(showName)}&embed[]=episodes&embed[]=nextepisode&embed[]=previousepisode`;
      const response = await fetch(singleSearchUrl);
      
      if (response.ok) {
        data = await response.json();
      } else if (response.status === 404) {
        const searchListUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(showName)}`;
        const listResponse = await fetch(searchListUrl);
        if (listResponse.ok) {
          const listData = await listResponse.json();
          if (listData && listData.length > 0) {
            const firstShowId = listData[0].show.id;
            const detailedUrl = `https://api.tvmaze.com/shows/${firstShowId}?embed[]=episodes&embed[]=nextepisode&embed[]=previousepisode`;
            const detailedResponse = await fetch(detailedUrl);
            if (detailedResponse.ok) {
              data = await detailedResponse.json();
            }
          }
        }
      }

      clearTimeout(timer);

      if (!data) {
        throw new Error("Could not find any show matching your query. Please check the spelling.");
      }

      const title = data.name;
      const type = data.type || "TV Show";

      const nextep = data._embedded?.nextepisode;
      const prevep = data._embedded?.previousepisode;
      const currentSeasonNum = nextep ? nextep.season : (prevep ? prevep.season : 1);
      const season = `Season ${currentSeasonNum}`;

      const allEpisodes = data._embedded?.episodes || [];
      const currentSeasonEpisodes = allEpisodes.filter(ep => ep.season === currentSeasonNum);
      const totalEpisodes = currentSeasonEpisodes.length > 0 ? currentSeasonEpisodes.length : null;

      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const todayStr = new Date(Date.now() - tzOffset).toISOString().split("T")[0];

      const airedEpisodes = currentSeasonEpisodes.filter(ep => ep.airdate && ep.airdate <= todayStr);
      const lastEpisodeAired = airedEpisodes.length > 0 ? airedEpisodes[airedEpisodes.length - 1].number : null;

      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      };

      const lastAirDate = prevep ? formatDate(prevep.airdate) : null;
      const nextEpisodeDate = nextep ? formatDate(nextep.airdate) : null;

      let status = "unknown";
      if (data.status === "Ended") {
        status = "aired";
      } else if (data.status === "Running" || data.status === "To Be Determined") {
        if (nextep) {
          status = airedEpisodes.length > 0 ? "airing" : "not_aired";
        } else {
          status = "aired"; 
        }
      }

      const cleanSummary = data.summary ? data.summary.replace(/<[^>]*>/g, "") : "";
      const summary = cleanSummary || `Check details for ${title} on TVmaze.`;

      const seasonMap = {};
      allEpisodes.forEach(ep => {
        if (ep.season) {
          if (!seasonMap[ep.season]) {
            seasonMap[ep.season] = { count: 0, episodes: [] };
          }
          seasonMap[ep.season].count++;
          seasonMap[ep.season].episodes.push(ep);
        }
      });
      
      const seasons = Object.keys(seasonMap).map(seasonNum => {
        const episodes = seasonMap[seasonNum].episodes;
        const allAired = episodes.every(ep => ep.airdate && ep.airdate <= todayStr);
        return {
          number: Number(seasonNum),
          episodeCount: seasonMap[seasonNum].count,
          aired: allAired,
          episodes: episodes.map(ep => ({
            id: ep.id,
            name: ep.name,
            number: ep.number,
            airdate: ep.airdate,
            aired: ep.airdate && ep.airdate <= todayStr,
          })),
        };
      }).sort((a, b) => a.number - b.number);

      const parsed = {
        id: data.id,
        title,
        type,
        status,
        season,
        totalEpisodes,
        lastEpisodeAired,
        lastAirDate,
        nextEpisodeDate,
        summary,
        source: "TVmaze",
        seasons,
        averageRuntime: data.averageRuntime,
        image: data.image?.medium || null,
        backdrop: data.image?.original || null,
        genres: data.genres || [],
        rating: data.rating?.average || null,
      };

      setResult(parsed);
      setStatus(STATUS.DONE);
      setHistory((h) => [
        { ...parsed, query: showName },
        ...h.filter((i) => i.title !== parsed.title).slice(0, 4),
      ]);
    } catch (err) {
      clearTimeout(timer);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus(STATUS.ERROR);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") checkShow(query);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-2xl text-indigo-500 shrink-0 shadow-sm">
              <i className="ti ti-device-tv" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Episode Status Checker</h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Find out if the latest episode of any show has aired yet</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:rotate-12 focus:outline-none cursor-pointer shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="ti ti-sun text-lg text-amber-400" />
            ) : (
              <i className="ti ti-moon text-lg text-indigo-600" />
            )}
          </button>
        </header>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. One Piece, The Bear, Arcane, Demon Slayer..."
            disabled={status === STATUS.LOADING}
            aria-label="Show or anime name"
            className="flex-1 bg-slate-100/50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-950 dark:text-slate-100 rounded-lg px-4 py-2 text-base outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            onClick={() => checkShow(query)}
            disabled={status === STATUS.LOADING || !query.trim()}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm shadow-indigo-600/10 cursor-pointer"
          >
            {status === STATUS.LOADING ? (
              <>
                <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
                Checking
              </>
            ) : (
              <>
                <i className="ti ti-search" aria-hidden="true" />
                Check
              </>
            )}
          </button>
        </div>

        {/* Watchlist Dashboard */}
        {watchlist.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Watchlist</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-slate-200/40 dark:bg-slate-800 px-2 py-0.5 rounded-full">{watchlist.length} shows</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {watchlist.map((show) => (
                <button
                  key={show.id}
                  onClick={() => { setQuery(show.title); checkShow(show.title); }}
                  className="group flex flex-col text-left bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer relative"
                >
                  {show.image ? (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950/10 relative">
                      <img src={show.image} alt={show.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <i className="ti ti-device-tv text-lg text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                  <div className="p-3 flex flex-col gap-0.5 relative">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate flex-1">{show.title}</span>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${show.status === "airing" ? "bg-blue-500 animate-pulse" : show.status === "aired" ? "bg-green-500" : "bg-amber-500"}`} />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{show.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === STATUS.LOADING && (
          <div className="bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm animate-fadeIn">
            <div className="flex justify-center gap-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
            </div>
            <p className="text-base font-medium text-slate-900 dark:text-slate-100">{loadingText}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Searching for "{query}"</p>
          </div>
        )}

        {status === STATUS.ERROR && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3.5 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5 animate-fadeIn">
            <i className="ti ti-alert-circle text-lg shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {status === STATUS.DONE && result && (
          <ResultCard 
            result={result} 
            watchlist={watchlist} 
            onToggleWatchlist={toggleTrackShow} 
          />
        )}

        {history.length > 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((item) => (
                <HistoryPill
                  key={item.title}
                  item={item}
                  onClick={() => { setQuery(item.query); checkShow(item.query); }}
                />
              ))}
            </div>
          </div>
        )}

        {status === STATUS.IDLE && (
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {["One Piece", "The Bear", "Arcane", "Demon Slayer", "Severance", "Jujutsu Kaisen"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); checkShow(s); }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-355 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs md:text-sm transition-all duration-150 hover:border-indigo-500/55 dark:hover:border-indigo-500/55 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
