export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function createPageItem(
  label: string,
  targetPage: number,
  options: { active?: boolean; disabled?: boolean },
  onChange: (page: number) => void,
): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'page-item';
  item.classList.toggle('active', Boolean(options.active));
  item.classList.toggle('disabled', Boolean(options.disabled));

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'page-link';
  button.textContent = label;
  button.disabled = Boolean(options.disabled);
  button.addEventListener('click', () => onChange(targetPage));

  item.append(button);
  return item;
}

/** Рендерить Bootstrap-пагінацію у контейнер. Якщо сторінка одна - нічого не показує. */
export function renderPagination(container: HTMLElement, props: PaginationProps): void {
  container.replaceChildren();
  if (props.totalPages <= 1) {
    return;
  }

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Пагінація');

  const list = document.createElement('ul');
  list.className = 'pagination pagination-sm justify-content-center mb-0 mt-3';

  list.append(createPageItem('‹', props.page - 1, { disabled: props.page === 1 }, props.onChange));
  for (let page = 1; page <= props.totalPages; page += 1) {
    list.append(
      createPageItem(String(page), page, { active: page === props.page }, props.onChange),
    );
  }
  list.append(
    createPageItem(
      '›',
      props.page + 1,
      { disabled: props.page === props.totalPages },
      props.onChange,
    ),
  );

  nav.append(list);
  container.append(nav);
}
