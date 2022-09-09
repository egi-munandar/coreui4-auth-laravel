import React from 'react'
import PropTypes from 'prop-types'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  // sortingFns,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import CIcon from '@coreui/icons-react'
import {
  cilArrowThickFromBottom,
  cilArrowThickFromTop,
  cilArrowThickLeft,
  cilArrowThickRight,
  cilArrowThickToLeft,
  cilArrowThickToRight,
} from '@coreui/icons'
import { CSpinner } from '@coreui/react'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// const fuzzySort = (rowA, rowB, columnId) => {
//   let dir = 0

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank,
//       rowB.columnFiltersMeta[columnId]?.itemRank,
//     )
//   }

//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
// }

function LTable({
  columns,
  data,
  className = 'table',
  thClass = '',
  tdClass = '',
  trClass = '',
  isLoading = false,
}) {
  const [columnFilters, setColumnFilters] = React.useState([])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })
  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className="p-2">
      <div className="h-2" />
      <table className={className}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={trClass} key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th className={thClass} key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <CIcon icon={cilArrowThickFromBottom} className="ms-2" />,
                            desc: <CIcon icon={cilArrowThickFromTop} className="ms-2" />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td className="d-flex justify-content-center" colSpan={columns.length}>
                <CSpinner variant="grow" color="primary" />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className={trClass}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td className={tdClass} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <CIcon icon={cilArrowThickToLeft} />
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <CIcon icon={cilArrowThickLeft} />
              </button>
            </li>
            <li className="page-item">
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="page-link"
                style={{ width: 100 }}
              />
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <CIcon icon={cilArrowThickRight} />
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <CIcon icon={cilArrowThickToRight} />
              </button>
            </li>
          </ul>
        </nav>
        <span className="flex items-center gap-1">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <select
          className="form-control form-control-sm"
          style={{ width: 120 }}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>Total {table.getPrePaginationRowModel().rows.length} Rows</div>
    </div>
  )
}
LTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  className: PropTypes.string,
  trClass: PropTypes.string,
  tdClass: PropTypes.string,
  thClass: PropTypes.string,
  isLoading: PropTypes.bool,
}
Filter.propTypes = {
  column: PropTypes.any,
  table: PropTypes.any,
}

function Filter({ column, table }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={columnFilterValue?.[0] ?? ''}
          onChange={(value) => column.setFilterValue((old) => [value, old?.[1]])}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={columnFilterValue?.[1] ?? ''}
          onChange={(value) => column.setFilterValue((old) => [old?.[0], value])}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ''}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="form-control form-control-sm"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
DebouncedInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  debounce: PropTypes.number,
}
export { LTable }
