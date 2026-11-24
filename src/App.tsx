import { BrowserRouter, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { appRoutes } from './routes'
import { hasPageAliases } from './data/pageAliases'
import { createAliasHistory } from './lib/aliasHistory'

// Ecopillo đã đổi link trang (Nội dung web → Đổi link trang): lịch sử trình duyệt đổi link trong ⇄ link mới. Không đổi thì như cũ
const ALIAS_HISTORY = hasPageAliases ? createAliasHistory() : null

export default function App() {
  const routes = <Routes>{appRoutes}</Routes>
  return ALIAS_HISTORY ? <HistoryRouter history={ALIAS_HISTORY}>{routes}</HistoryRouter> : <BrowserRouter>{routes}</BrowserRouter>
}
