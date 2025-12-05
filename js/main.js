import { postsData } from './data.js';

window.addEventListener('DOMContentLoaded', () => {
    function parseDateDMY(dateString) {
        const parts = dateString.split(/[-_]/);

        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            return new Date(year, month - 1, day);
        }

        return null;
    }

    const formatDateToCustomFormat = (dateString) => {
        const dateObject = new Date(dateString);
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();

        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        return `${formattedDay}_${formattedMonth}_${year}`;
    }

    const dateFromInput = document.querySelector('#date-from');
    const dateToInput = document.querySelector('#date-to');

    dateFromInput.addEventListener('change', handleDateFilterChange);
    dateToInput.addEventListener('change', handleDateFilterChange);

    const start = datepicker('#date-from', {
        id: 1,
        customDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        showAllDates : true,
        formatter: (input, date) => {
            input.value = formatDateToCustomFormat(date.toDateString());
        },
        onSelect: handleDateFilterChange
    });
    const end = datepicker('#date-to', {
        id: 1,
        customDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        showAllDates : true,
        formatter: (input, date) => {
            input.value = formatDateToCustomFormat(date.toDateString());
        },
        onSelect: handleDateFilterChange
    });

    function handleDateFilterChange() {
        const range = start.getRange();
        const startDate = range.start;
        const endDate = range.end;

        if (!startDate && !endDate) {
            renderPosts(postsData);
            return;
        }

        const filteredData = postsData.filter(post => {
            const postDate = parseDateDMY(post.date);

            if (!postDate) return false;

            if (endDate) endDate.setHours(23, 59, 59, 999);

            const isAfterStart = !startDate || postDate >= startDate;
            const isBeforeEnd = !endDate || postDate <= endDate;

            return isAfterStart && isBeforeEnd;
        });

        renderPosts(filteredData);
    }

    function initializeApp() {
        renderPosts(postsData);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    const buttonCloseDateList = document.querySelectorAll('.filter-date-panel .close');

    buttonCloseDateList.forEach((buttonCloseDate) => {
        buttonCloseDate.addEventListener('click', (element) => {
            const typeDate = element.target.getAttribute('data-input');

            if (typeDate === 'date-from') {
                start.setDate(null);
                start.hide();
                handleDateFilterChange();
            } else if (typeDate === 'date-to') {
                end.setDate(null);
                end.hide();
                handleDateFilterChange();
            }
        })
    })


    const contentArea = document.getElementById('content-area');
    const listBtn = document.getElementById('gridViewBtn');
    const gridBtn = document.getElementById('listViewBtn');

    listBtn.addEventListener('click', (event) => {
        contentArea.classList.remove('grid-view');
        contentArea.classList.add('list-view');

        event.currentTarget.classList.add('active');
        gridBtn.classList.remove('active');
    });

    gridBtn.addEventListener('click', (event) => {
        contentArea.classList.remove('list-view');
        contentArea.classList.add('grid-view');

        event.currentTarget.classList.add('active');
        listBtn.classList.remove('active');
    });
});

const postsContainer = document.getElementById('content-area');

function createPostElement(post) {
    const postItem = document.createElement('div');
    postItem.classList.add('post-item');
    postItem.dataset.postId = post.id;

    postItem.innerHTML = `
            <img src="${post.imageUrl}" alt="Post image" class="post-image">
            <div class="post-details">
                <div class="name-box">
                    <span class="post-title">${post.title}</span>
                    <span class="feedback-panel">
                        <span class="like">
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M1.5 6.3C1.49991 5.76177 1.6071 5.22893 1.8153 4.73261C2.02351 4.23629 2.32855 3.78644 2.71261 3.40937C3.09667 3.03229 3.55203 2.73555 4.05209 2.53649C4.55215 2.33742 5.08687 2.24003 5.625 2.25C6.26172 2.24662 6.89189 2.3786 7.47374 2.6372C8.05559 2.8958 8.57584 3.27511 9 3.75C9.42416 3.27511 9.94441 2.8958 10.5263 2.6372C11.1081 2.3786 11.7383 2.24662 12.375 2.25C12.9131 2.24003 13.4479 2.33742 13.9479 2.53649C14.448 2.73555 14.9033 3.03229 15.2874 3.40937C15.6714 3.78644 15.9765 4.23629 16.1847 4.73261C16.3929 5.22893 16.5001 5.76177 16.5 6.3C16.5 10.317 11.7157 13.35 9 15.75C6.29025 13.3297 1.5 10.32 1.5 6.3Z" fill="black"/>
                                </svg>
                            </span>
                            <span>${post.likesCount}</span>
                        </span>
                        <span class="comment">
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M16.5 3C16.5 2.175 15.825 1.5 15 1.5H3C2.175 1.5 1.5 2.175 1.5 3V12C1.5 12.825 2.175 13.5 3 13.5H13.5L16.5 16.5V3Z" fill="black"/>
                                </svg>
                            </span>
                            <span>${post.commentsCount}</span>
                        </span>
                    </span>
                </div>
                <div class="date-box">
                    <span class="post-title">${post.date}</span>
                    <span class="feedback-panel">
                        <span class="like">
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M1.5 6.3C1.49991 5.76177 1.6071 5.22893 1.8153 4.73261C2.02351 4.23629 2.32855 3.78644 2.71261 3.40937C3.09667 3.03229 3.55203 2.73555 4.05209 2.53649C4.55215 2.33742 5.08687 2.24003 5.625 2.25C6.26172 2.24662 6.89189 2.3786 7.47374 2.6372C8.05559 2.8958 8.57584 3.27511 9 3.75C9.42416 3.27511 9.94441 2.8958 10.5263 2.6372C11.1081 2.3786 11.7383 2.24662 12.375 2.25C12.9131 2.24003 13.4479 2.33742 13.9479 2.53649C14.448 2.73555 14.9033 3.03229 15.2874 3.40937C15.6714 3.78644 15.9765 4.23629 16.1847 4.73261C16.3929 5.22893 16.5001 5.76177 16.5 6.3C16.5 10.317 11.7157 13.35 9 15.75C6.29025 13.3297 1.5 10.32 1.5 6.3Z" fill="black"/>
                                </svg>
                            </span>
                            <span>${post.likesCount}</span>
                        </span>
                        <span class="comment">
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M16.5 3C16.5 2.175 15.825 1.5 15 1.5H3C2.175 1.5 1.5 2.175 1.5 3V12C1.5 12.825 2.175 13.5 3 13.5H13.5L16.5 16.5V3Z" fill="black"/>
                                </svg>
                            </span>
                            <span>${post.commentsCount}</span>
                        </span>
                    </span>
                </div>
            </div>
            <span class="post-status flex">
                <span class="post-title">${post.statusTitle}</span>
                <span class="date-title">${post.statusDate}</span>
            </span>
        `;

    return postItem;
}

function renderPosts(postsArray) {
    postsContainer.innerHTML = '';
    postsArray.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderPosts(postsData);
});