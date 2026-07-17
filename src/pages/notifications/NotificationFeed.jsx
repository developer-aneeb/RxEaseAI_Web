import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '../../components/ui/MaterialIcon';
import { MoreVertical, CheckCircle2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NotificationFeed({ 
  items = [], 
  onMarkRead, 
  onDelete,
  emptyMessage = "No notifications found on this page."
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination bounds calculation
  const totalFilteredCount = items.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;
  
  // Clamp page if items shrink
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items, totalPages, currentPage]);

  const paginatedNotifications = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const todayItems = paginatedNotifications.filter(n => n.isToday);
  const olderItems = paginatedNotifications.filter(n => !n.isToday);

  return (
    <div className="flex flex-col gap-6">
      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Today Items */}
          {todayItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>Today</span>
                <span className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></span>
              </h3>
              <AnimatePresence>
                {todayItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden group text-left ${item.priority === 'high'
                      ? 'border-rose-250 dark:border-rose-900/50 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
                      : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
                      }`}
                  >
                    {item.priority === 'high' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                    )}
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconColor}`}>
                        <MaterialIcon name={item.iconName} size="sm" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {activeDropdown === item.id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                                {item.unread && (
                                  <button onClick={() => { onMarkRead(item.id); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Mark Read
                                  </button>
                                )}
                                <button onClick={() => { onDelete(item.id); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          {item.title}
                          {item.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

      {/* Older Items */}
      {olderItems.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>Older Notifications</span>
            <span className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></span>
          </h3>

          <AnimatePresence>
            {olderItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden text-left ${item.priority === 'high'
                  ? 'border-rose-250 dark:border-rose-900/50 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
                  : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {item.priority === 'high' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                )}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <MaterialIcon name={item.iconName} size="sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-500">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === item.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                            {item.unread && (
                              <button onClick={() => { onMarkRead(item.id); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Mark Read
                              </button>
                            )}
                            <button onClick={() => { onDelete(item.id); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {item.title}
                      {item.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
        </>
      )}

      {/* Pagination Controls Row */}
      {totalFilteredCount > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 font-bold outline-none text-slate-800 dark:text-white cursor-pointer"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span>of {totalFilteredCount} matching</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {(() => {
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, start + 4);
              if (end - start < 4) {
                start = Math.max(1, end - 4);
              }
              const pages = [];
              for (let i = start; i <= end; i++) {
                pages.push(i);
              }
              return pages.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer bg-transparent ${currentPage === page
                    ? 'border-primary text-primary shadow-sm ring-1 ring-primary/45 font-black'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {page}
                </button>
              ));
            })()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
