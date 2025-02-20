import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import mixins from 'js/mixins';
import bem, {makeBem} from 'js/bem';
import KoboDropdown from 'js/components/common/koboDropdown';
import {PERMISSIONS_CODENAMES} from 'js/constants';
import {SORT_VALUES} from 'js/components/submissions/tableConstants';
import './tableColumnSortDropdown.scss';

const CLEAR_BUTTON_CLASS_NAME = 'table-column-sort-dropdown-clear';

bem.SortDropdownMenuButton = makeBem(null, 'sort-dropdown-menu-button', 'button');

/**
 * A wrapper around KoboDropdown to be used in table header to sort columns.
 *
 * @prop {object} asset
 * @prop {string} fieldId - one of table columns
 * @prop {string|null} sortValue
 * @prop {function} onSortChange
 * @prop {function} onHide
 * @prop {boolean} isFieldFrozen
 * @prop {function} onFrozenChange
 * @prop {Node} [additionalTriggerContent] - to be put inside trigger, before the predefined content. Please note that the trigger as a whole is clickable, so this additional content would need stopPropagation to be clickable.
 */
class TableColumnSortDropdown extends React.Component {
  constructor(props){
    super(props);
    autoBind(this);
  }

  renderTrigger() {
    let sortIcon = ['k-icon'];
    if (this.props.sortValue && this.props.sortValue === SORT_VALUES.ASCENDING) {
      sortIcon.push('k-icon-sort-ascending');
    }
    if (this.props.sortValue && this.props.sortValue === SORT_VALUES.DESCENDING) {
      sortIcon.push('k-icon-sort-descending');
    }

    return (
      <div className='table-column-sort-dropdown-trigger'>
        {this.props.additionalTriggerContent}
        {this.props.sortValue &&
          <i className={sortIcon.join(' ')}/>
        }
        <i className='k-icon k-icon-caret-up'/>
        <i className='k-icon k-icon-caret-down'/>
      </div>
    );
  }

  clearSort() {
    this.props.onSortChange(this.props.fieldId, null);
  }

  changeSort(sortValue, evt) {
    // When clicking on clear icon button, we need to avoid triggering also the
    // change sort button. We can't use `stopPropagation` on `clearSort` as it
    // breaks `onMenuClick` functionality.
    if (evt?.target?.classList?.contains(CLEAR_BUTTON_CLASS_NAME)) {
      return;
    }
    this.props.onSortChange(this.props.fieldId, sortValue);
  }

  hideField() {
    this.props.onHide(this.props.fieldId);
  }

  changeFieldFrozen(isFrozen) {
    this.props.onFrozenChange(this.props.fieldId, isFrozen);
  }

  renderSortButton(buttonSortValue) {
    return (
      <bem.SortDropdownMenuButton
        m={{active: this.props.sortValue === buttonSortValue}}
        onClick={this.changeSort.bind(this, buttonSortValue)}
      >
        {buttonSortValue === SORT_VALUES.ASCENDING && [
          <i key='0' className='k-icon k-icon-sort-ascending'/>,
          <span key='1'>{t('Sort A→Z')}</span>,
        ]}
        {buttonSortValue === SORT_VALUES.DESCENDING && [
          <i key='0' className='k-icon k-icon-sort-descending'/>,
          <span key='1'>{t('Sort Z→A')}</span>,
        ]}

        {this.props.sortValue === buttonSortValue &&
          <i
            onClick={this.clearSort}
            className={classNames('k-icon', 'k-icon-close', CLEAR_BUTTON_CLASS_NAME)}
          />
        }
      </bem.SortDropdownMenuButton>
    );
  }

  render() {
    return (
      <KoboDropdown
        hideOnMenuClick
        name='table-column-sort'
        triggerContent={this.renderTrigger()}
        menuContent={
          <React.Fragment>
            {this.renderSortButton(SORT_VALUES.ASCENDING)}
            {this.renderSortButton(SORT_VALUES.DESCENDING)}

            {mixins.permissions.userCan(PERMISSIONS_CODENAMES.change_asset, this.props.asset) &&
              <bem.SortDropdownMenuButton onClick={this.hideField}>
                <i className='k-icon k-icon-hide'/>
                <span>{t('Hide field')}</span>
              </bem.SortDropdownMenuButton>
            }
            {mixins.permissions.userCan(PERMISSIONS_CODENAMES.change_asset, this.props.asset) &&
              <bem.SortDropdownMenuButton
                onClick={this.changeFieldFrozen.bind(this, !this.props.isFieldFrozen)}
              >
                {this.props.isFieldFrozen && [
                  <i key='0' className='k-icon k-icon-unfreeze'/>,
                  <span key='1'>{t('Unfreeze field')}</span>,
                ]}
                {!this.props.isFieldFrozen && [
                  <i key='0' className='k-icon k-icon-freeze'/>,
                  <span key='1'>{t('Freeze field')}</span>,
                ]}
              </bem.SortDropdownMenuButton>
            }
          </React.Fragment>
        }
      />
    );
  }
}

export default TableColumnSortDropdown;
