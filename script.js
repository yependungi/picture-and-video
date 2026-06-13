const JOB_API_URL = "https://www.arbeitnow.com/api/job-board-api";

const storageKeys = {
  resume: "jobbridge.resume",
  postings: "jobbridge.postings",
  applied: "jobbridge.applied",
};

const sampleResume = {
  name: "김서연",
  phone: "010-1234-5678",
  email: "seoyeon.kim@example.com",
  role: "서비스 기획자",
  experience: "4-7년",
  location: "서울 또는 하이브리드",
  skills: "서비스 기획, 데이터 분석, Figma, SQL, 고객 인터뷰",
  portfolio: "https://portfolio.example.com",
  education: "한국대학교 경영학과 졸업\n공공 서비스 개선 프로젝트 PM",
  summary:
    "사용자 리서치와 데이터 분석을 기반으로 복잡한 서비스를 단순하게 정리하는 일을 해왔습니다. 운영 조직과 개발 조직 사이에서 요구사항을 구조화하고, 출시 이후 지표를 보며 개선안을 실행하는 데 강점이 있습니다.",
};

const fallbackLiveJobs = [
  {
    id: "arbeitnow-forensic-solution-engineer-munich-276694",
    source: "Arbeitnow 스냅샷",
    organization: "Arina Deutschland GmbH",
    department: "",
    title: "Forensic Solution Engineer m/w/d",
    type: "경력",
    mode: "출근",
    region: "Munich",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781278228),
    skills: "Consulting, Engineering, Digital Forensics",
    description:
      "디지털 포렌식과 eDiscovery 솔루션의 고객 평가, 설치, 구성, 자동화 워크플로 개발과 기술 워크숍을 맡는 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/arina-deutschland-gmbh/forensic-solution-engineer-munich-276694",
  },
  {
    id: "arbeitnow-working-student-finance-berlin-217961",
    source: "Arbeitnow 스냅샷",
    organization: "mrge - commerce advertising",
    department: "",
    title: "Working Student Finance",
    type: "학생",
    mode: "출근",
    region: "Berlin",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781278228),
    skills: "Finance, Billing, Payments, Excel",
    description:
      "광고 커머스 기업의 청구 및 결제 재무팀에서 인보이스 검토, 결제 정산, 회계 운영 보조를 담당하는 학생 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/mrge-commerce-advertising/working-student-finance-berlin-217961",
  },
  {
    id: "arbeitnow-devops-platform-engineer-remote-dusseldorf-9008",
    source: "Arbeitnow 스냅샷",
    organization: "Pont Connects e.K.",
    department: "",
    title: "DevOps / Platform Engineer (m/w/d) REMOTE",
    type: "경력",
    mode: "원격",
    region: "Dusseldorf",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781276432),
    skills: "Remote, IT, GitLab CI, Docker, Kubernetes",
    description:
      "클라우드 리소스 자동화, CI/CD 파이프라인, 컨테이너 운영, 모니터링과 보안 개선을 다루는 원격 DevOps 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/pont-connects-ek/devops-platform-engineer-remote-dusseldorf-9008",
  },
  {
    id: "arbeitnow-junior-data-analyst-berlin-284562",
    source: "Arbeitnow 스냅샷",
    organization: "mrge - commerce advertising",
    department: "",
    title: "Junior Data Analyst",
    type: "신입",
    mode: "출근",
    region: "Berlin",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781276432),
    skills: "Finance, SQL, Excel, Data Analysis",
    description:
      "결제 및 청구 데이터를 분석하고, SQL과 스프레드시트로 재무 데이터 정합성 확인과 리포팅을 지원하는 주니어 데이터 분석 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/mrge-commerce-advertising/junior-data-analyst-berlin-284562",
  },
  {
    id: "arbeitnow-kunden-vertragsmanager-mensch-hamburg-426129",
    source: "Arbeitnow 스냅샷",
    organization: "Eventinc GmbH",
    department: "",
    title: "Kunden- & Vertragsmanager (Mensch)",
    type: "경력",
    mode: "출근",
    region: "Hamburg",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781276432),
    skills: "Customer Service, Contracts, CRM, Events",
    description:
      "기업 고객 이벤트 계약, 고객 커뮤니케이션, CRM 데이터 관리와 일정 조율을 맡는 고객 및 계약 관리 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/eventinc-gmbh/kunden-vertragsmanager-mensch-hamburg-426129",
  },
  {
    id: "arbeitnow-aviation-data-analytics-manager-munich-206641",
    source: "Arbeitnow 스냅샷",
    organization: "Skailark",
    department: "",
    title: "Aviation Data & Analytics Manager (m/f/d)",
    type: "경력",
    mode: "하이브리드",
    region: "Munich",
    salary: "원문 확인",
    postedAt: fromUnixDate(1781276432),
    skills: "Data Analytics, Aviation, Finance, Alteryx",
    description:
      "항공 산업 데이터를 구조화하고 분석 모델과 데이터 파이프라인을 개선해 고객 인사이트 품질을 높이는 데이터 분석 매니저 포지션입니다.",
    url: "https://www.arbeitnow.com/jobs/companies/skailark/aviation-data-analytics-manager-munich-206641",
  },
];

const state = {
  resume: readStorage(storageKeys.resume, {}),
  postings: readStorage(storageKeys.postings, []),
  applied: readStorage(storageKeys.applied, {}),
  liveJobs: [],
  liveSource: "fallback",
  jobsLoadedAt: "",
};

const elements = {
  tabs: document.querySelectorAll(".tab-button"),
  sections: document.querySelectorAll(".workspace-section"),
  resumeForm: document.querySelector("#resumeForm"),
  postingForm: document.querySelector("#postingForm"),
  loadSampleResume: document.querySelector("#loadSampleResume"),
  resumeSavedState: document.querySelector("#resumeSavedState"),
  postingSavedState: document.querySelector("#postingSavedState"),
  jobCountState: document.querySelector("#jobCountState"),
  jobSourceState: document.querySelector("#jobSourceState"),
  jobFeedMeta: document.querySelector("#jobFeedMeta"),
  refreshJobs: document.querySelector("#refreshJobs"),
  jobList: document.querySelector("#jobList"),
  jobCardTemplate: document.querySelector("#jobCardTemplate"),
  searchInput: document.querySelector("#searchInput"),
  typeFilter: document.querySelector("#typeFilter"),
  modeFilter: document.querySelector("#modeFilter"),
  latestPostingTitle: document.querySelector("#latestPostingTitle"),
  latestPostingSummary: document.querySelector("#latestPostingSummary"),
  latestPostingMeta: document.querySelector("#latestPostingMeta"),
  metricJobs: document.querySelector("#metricJobs"),
  metricApplied: document.querySelector("#metricApplied"),
  metricResume: document.querySelector("#metricResume"),
  previewName: document.querySelector("#previewName"),
  previewRole: document.querySelector("#previewRole"),
  previewContact: document.querySelector("#previewContact"),
  previewExperience: document.querySelector("#previewExperience"),
  previewLocation: document.querySelector("#previewLocation"),
  previewSkills: document.querySelector("#previewSkills"),
  previewSummary: document.querySelector("#previewSummary"),
};

init();

function init() {
  fillForm(elements.resumeForm, state.resume);
  setDefaultDeadline();
  bindEvents();
  renderAll();
  loadLiveJobs();
}

function bindEvents() {
  elements.tabs.forEach((button) => {
    button.addEventListener("click", () => activateSection(button.dataset.section));
  });

  elements.resumeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.resume = formToObject(elements.resumeForm);
    writeStorage(storageKeys.resume, state.resume);
    elements.resumeSavedState.textContent = "저장 완료";
    renderAll();
  });

  elements.resumeForm.addEventListener("input", () => {
    const draft = formToObject(elements.resumeForm);
    renderResume(draft);
    elements.resumeSavedState.textContent = hasResume(draft) ? "작성 중" : "저장 전";
  });

  elements.loadSampleResume.addEventListener("click", () => {
    fillForm(elements.resumeForm, sampleResume);
    state.resume = { ...sampleResume };
    writeStorage(storageKeys.resume, state.resume);
    elements.resumeSavedState.textContent = "예시 저장";
    renderAll();
  });

  elements.postingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const posting = {
      ...formToObject(elements.postingForm),
      id: `custom-${Date.now()}`,
      source: "기관 등록",
      url: "",
    };
    state.postings.unshift(posting);
    writeStorage(storageKeys.postings, state.postings);
    elements.postingSavedState.textContent = "등록 완료";
    elements.postingForm.reset();
    setDefaultDeadline();
    renderAll();
    activateSection("jobs");
  });

  elements.postingForm.addEventListener("reset", () => {
    setTimeout(() => {
      setDefaultDeadline();
      elements.postingSavedState.textContent = "등록 대기";
    }, 0);
  });

  elements.refreshJobs.addEventListener("click", loadLiveJobs);

  [elements.searchInput, elements.typeFilter, elements.modeFilter].forEach((control) => {
    control.addEventListener("input", renderJobs);
    control.addEventListener("change", renderJobs);
  });
}

async function loadLiveJobs() {
  elements.refreshJobs.disabled = true;
  elements.jobSourceState.textContent = "Arbeitnow API 불러오는 중";
  elements.jobFeedMeta.textContent = "공개 채용 API에서 최신 공고를 확인하고 있습니다.";

  try {
    const response = await fetch(JOB_API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`API 응답 오류: ${response.status}`);

    const payload = await response.json();
    const jobs = Array.isArray(payload.data) ? payload.data : [];
    state.liveJobs = jobs.slice(0, 18).map(normalizeArbeitnowJob);
    state.liveSource = "live";
    state.jobsLoadedAt = new Date().toISOString();
  } catch (error) {
    state.liveJobs = [];
    state.liveSource = "fallback";
    state.jobsLoadedAt = "";
  } finally {
    elements.refreshJobs.disabled = false;
    renderAll();
  }
}

function normalizeArbeitnowJob(job) {
  const tags = [...new Set([...(job.tags || []), ...(job.job_types || [])])].filter(Boolean);
  const title = cleanText(job.title);

  return {
    id: `arbeitnow-${job.slug || hashText(job.url || title)}`,
    source: "Arbeitnow 실시간",
    organization: cleanText(job.company_name) || "회사명 원문 확인",
    department: "",
    title: title || "제목 원문 확인",
    type: normalizeJobType(job.job_types, title),
    mode: normalizeWorkMode(job),
    region: cleanText(job.location) || "지역 원문 확인",
    salary: "급여 원문 확인",
    postedAt: fromUnixDate(job.created_at),
    skills: tags.slice(0, 8).join(", "),
    description: summarizeDescription(job.description),
    url: job.url || "",
  };
}

function activateSection(sectionId) {
  elements.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  elements.sections.forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });
}

function renderAll() {
  renderResume(state.resume);
  renderLatestPosting();
  renderJobs();
  renderMetrics();
  renderJobSource();
}

function renderResume(resume) {
  elements.previewName.textContent = resume.name || "이름";
  elements.previewRole.textContent = resume.role || "-";
  elements.previewContact.textContent = [resume.email, resume.phone].filter(Boolean).join(" · ") || "-";
  elements.previewExperience.textContent = resume.experience || "-";
  elements.previewLocation.textContent = resume.location || "-";
  elements.previewSummary.textContent = resume.summary || "입력한 자기소개가 이곳에 표시됩니다.";
  renderTags(elements.previewSkills, resume.skills);
}

function renderLatestPosting() {
  const latest = state.postings[0];
  if (!latest) {
    elements.latestPostingTitle.textContent = "등록된 공고";
    elements.latestPostingSummary.textContent = "기관 공고를 등록하면 이곳과 공고 탐색 목록에 반영됩니다.";
    elements.latestPostingMeta.innerHTML = "";
    return;
  }

  elements.latestPostingTitle.textContent = latest.title;
  elements.latestPostingSummary.textContent = latest.description;
  elements.latestPostingMeta.innerHTML = "";

  [
    ["기관", latest.organization],
    ["지역", latest.region],
    ["마감", formatDate(latest.deadline)],
    ["형태", `${latest.type} · ${latest.mode}`],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    row.innerHTML = `<span>${label}</span><strong>${escapeHtml(value || "-")}</strong>`;
    elements.latestPostingMeta.append(row);
  });
}

function renderJobs() {
  const jobs = getAllJobs();
  const search = elements.searchInput.value.trim().toLowerCase();
  const type = elements.typeFilter.value;
  const mode = elements.modeFilter.value;
  const filtered = jobs.filter((job) => {
    const haystack = [
      job.title,
      job.organization,
      job.department,
      job.region,
      job.skills,
      job.description,
      job.source,
    ]
      .join(" ")
      .toLowerCase();

    return (!search || haystack.includes(search)) && (!type || job.type === type) && (!mode || job.mode === mode);
  });

  elements.jobList.innerHTML = "";
  elements.jobCountState.textContent = `${filtered.length}개 공고`;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 공고가 없습니다.";
    elements.jobList.append(empty);
    return;
  }

  filtered.forEach((job) => {
    const node = elements.jobCardTemplate.content.firstElementChild.cloneNode(true);
    const appliedAt = state.applied[job.id];
    node.querySelector(".job-source").textContent = job.source;
    node.querySelector(".job-deadline").textContent = formatJobTimeline(job);
    node.querySelector("h3").textContent = job.title;
    node.querySelector(".job-org").textContent = `${job.organization}${job.department ? ` · ${job.department}` : ""}`;
    node.querySelector(".job-desc").textContent = job.description;

    const meta = node.querySelector(".job-meta");
    [job.type, job.mode, job.region, job.salary].filter(Boolean).forEach((item) => {
      const pill = document.createElement("span");
      pill.textContent = item;
      meta.append(pill);
    });

    renderTags(node.querySelector(".tag-list"), job.skills);

    const applyButton = node.querySelector("[data-apply]");
    applyButton.classList.toggle("applied", Boolean(appliedAt));
    applyButton.lastChild.textContent = appliedAt ? " 표시 완료" : " 지원 표시";
    applyButton.addEventListener("click", () => applyToJob(job.id));

    const originalLink = node.querySelector("[data-original]");
    if (job.url) {
      originalLink.href = job.url;
      originalLink.hidden = false;
    } else {
      originalLink.hidden = true;
    }

    elements.jobList.append(node);
  });
}

function renderMetrics() {
  elements.metricJobs.textContent = getAllJobs().length;
  elements.metricApplied.textContent = Object.keys(state.applied).length;
  elements.metricResume.textContent = hasResume(state.resume) ? "완성" : "미완성";
}

function renderJobSource() {
  const liveCount = state.liveJobs.length;
  if (state.liveSource === "live" && liveCount) {
    elements.jobSourceState.textContent = `Arbeitnow 실시간 공고 ${liveCount}개`;
    elements.jobFeedMeta.textContent = `${formatDateTime(state.jobsLoadedAt)} 기준으로 공개 API에서 불러왔습니다.`;
    return;
  }

  elements.jobSourceState.textContent = `Arbeitnow 실제 공고 스냅샷 ${fallbackLiveJobs.length}개`;
  elements.jobFeedMeta.textContent = "API 연결이 막혀도 원문 링크가 있는 실제 공고 스냅샷을 표시합니다.";
}

function applyToJob(jobId) {
  const currentResume = formToObject(elements.resumeForm);
  if (!hasResume(currentResume)) {
    activateSection("resume");
    elements.resumeSavedState.textContent = "이력서 필요";
    elements.resumeForm.querySelector("[name='name']").focus();
    return;
  }

  state.resume = currentResume;
  state.applied[jobId] = new Date().toISOString();
  writeStorage(storageKeys.resume, state.resume);
  writeStorage(storageKeys.applied, state.applied);
  elements.resumeSavedState.textContent = "저장 완료";
  renderAll();
}

function renderTags(container, value) {
  container.innerHTML = "";
  parseTags(value).forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    container.append(span);
  });
}

function parseTags(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function getAllJobs() {
  const liveJobs = state.liveJobs.length ? state.liveJobs : fallbackLiveJobs;
  return [...state.postings, ...liveJobs];
}

function hasResume(resume) {
  return Boolean(resume.name && resume.email && resume.role && resume.summary);
}

function fillForm(form, data) {
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setDefaultDeadline() {
  const field = elements.postingForm.elements.deadline;
  if (!field.value) {
    const date = new Date();
    date.setDate(date.getDate() + 21);
    field.value = date.toISOString().slice(0, 10);
  }
}

function normalizeJobType(jobTypes = [], title = "") {
  const text = [...jobTypes, title].join(" ").toLowerCase();
  if (text.includes("working student") || text.includes("student")) return "학생";
  if (text.includes("intern")) return "인턴";
  if (text.includes("entry") || text.includes("junior") || text.includes("no experience")) return "신입";
  if (text.includes("part") || text.includes("teilzeit")) return "파트타임";
  if (text.includes("berufserfahren") || text.includes("senior") || text.includes("experienced")) return "경력";
  return "정규직";
}

function normalizeWorkMode(job) {
  const text = `${job.title || ""} ${job.location || ""} ${(job.tags || []).join(" ")}`.toLowerCase();
  if (job.remote || text.includes("remote")) return "원격";
  if (text.includes("hybrid")) return "하이브리드";
  return "출근";
}

function summarizeDescription(html = "") {
  const text = cleanText(stripHtml(html));
  if (!text) return "상세 모집 내용은 원문 공고에서 확인할 수 있습니다.";
  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
}

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function cleanText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function fromUnixDate(value) {
  if (!value) return "";
  return new Date(Number(value) * 1000).toISOString();
}

function formatJobTimeline(job) {
  if (job.deadline) return `마감 ${formatDate(job.deadline)}`;
  if (job.postedAt) return `게시 ${formatDate(job.postedAt)}`;
  return "일정 원문 확인";
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
