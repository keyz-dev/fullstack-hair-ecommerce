import React, { useEffect } from "react";
import { Table, Pagination, DropdownMenu, StatusPill, AdvancedFilters, FadeInContainer } from "../../ui";
import { Edit, Trash2, Eye, FileText, Calendar, User } from "lucide-react";
import { usePost } from "../../../hooks";
import { useCategory } from "../../../hooks";
import { formatDate } from "../../../utils/dateUtils";

const PostsListView = ({ onEdit, onView, onDelete }) => {
  const {
    posts, 
    pagination, 
    fetchPosts, 
    setPageAndFetch, 
    setSearchAndFetch, 
    search, 
    filters, 
    setFiltersAndFetch,
    clearAllFilters,
    loading
  } = usePost();

  const { categories } = useCategory();

  // Filter configurations
  const filterConfigs = [
    {
      key: 'category',
      label: 'Category',
      defaultValue: '',
      colorClass: 'bg-blue-100 text-blue-800',
      options: [
        { value: '', label: 'All Categories' },
        ...(categories || []).map(cat => ({
          value: cat._id,
          label: cat.name
        }))
      ]
    },
    {
      key: 'status',
      label: 'Status',
      defaultValue: '',
      colorClass: 'bg-green-100 text-green-800',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ]
    },
    {
      key: 'postType',
      label: 'Type',
      defaultValue: '',
      colorClass: 'bg-purple-100 text-purple-800',
      options: [
        { value: '', label: 'All Types' },
        { value: 'work-showcase', label: 'Work Showcase' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'product-review', label: 'Product Review' },
        { value: 'styling-tip', label: 'Styling Tip' },
        { value: 'transformation', label: 'Transformation' },
        { value: 'technique-demo', label: 'Technique Demo' },
        { value: 'promotion', label: 'Promotion' },
      ]
    },
    {
      key: 'featured',
      label: 'Featured',
      defaultValue: '',
      colorClass: 'bg-orange-100 text-orange-800',
      options: [
        { value: '', label: 'All Posts' },
        { value: 'true', label: 'Featured Only' },
        { value: 'false', label: 'Not Featured' },
      ]
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (filterName, value) => {
    setFiltersAndFetch({ ...filters, [filterName]: value });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {row.images && row.images.length > 0 ? (
                <img 
                  className="h-10 w-10 rounded-lg object-cover" 
                  src={row.images[0].url} 
                  alt={row.title} 
                />
              ) : row.video?.thumbnail ? (
                <img 
                  className="h-10 w-10 rounded-lg object-cover" 
                  src={row.video.thumbnail} 
                  alt={row.title} 
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <FileText size={16} className="text-gray-500" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.title}
              </div>
              <div className="text-sm text-gray-500">
                {row.description?.substring(0, 50)}...
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {row.postType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 mr-2">
                    {row.postType.replace('-', ' ')}
                  </span>
                )}
                {row.categories && row.categories.length > 0 && (
                  <span className="text-gray-500">
                    {row.categories.map(cat => cat.name).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const getStatusConfig = (status) => {
            if (status === 'published') {
              return { status: "active", text: "Published" };
            } else if (status === 'draft') {
              return { status: "draft", text: "Draft" };
            } else if (status === 'archived') {
              return { status: "inactive", text: "Archived" };
            }
            return { status: "draft", text: "Draft" };
          };

          const statusConfig = getStatusConfig(row.status);
          
          return (
            <div className="flex flex-col gap-1">
              <StatusPill
                status={statusConfig.status}
                text={statusConfig.text}
              />
              {row.featured && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  Featured
                </span>
              )}
            </div>
          );
        },
      },
      {
        Header: "Author",
        accessor: "author",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-500" />
            <span className="text-sm text-gray-900">
              {row.author?.name || 'Unknown'}
            </span>
          </div>
        ),
      },
      {
        Header: "Published",
        accessor: "publishedAt",
        Cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {row.publishedAt ? formatDate(row.publishedAt) : 'Not published'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Created: {formatDate(row.createdAt)}
            </div>
          </div>
        ),
      },
      {
        Header: "Engagement",
        accessor: "engagement",
        Cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                👁️ {row.views || 0} views
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                ❤️ {row.likes?.length || 0} likes
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {row.tags && row.tags.length > 0 && (
                <span>Tags: {row.tags.slice(0, 2).join(', ')}{row.tags.length > 2 ? '...' : ''}</span>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "View Post",
              icon: <Eye size={16} />,
              onClick: () => onView(row),
            },
            {
              label: "Edit Post",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete Post",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              isDestructive: true,
            },
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onEdit, onView, onDelete]
  );

  return (
    <div className="space-y-6">
      {/* Advanced Search and Filters */}
      <FadeInContainer delay={200} duration={600}>
        <AdvancedFilters
          filters={{ ...filters, search }}
          onFilterChange={handleFilterChange}
          onSearch={setSearchAndFetch}
          onClearAll={clearAllFilters}
          filterConfigs={filterConfigs}
          searchPlaceholder="Search posts by title, description, or tags..."
        />
      </FadeInContainer>

      {/* Table */}
      <FadeInContainer delay={400} duration={600}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            columns={columns}
            data={posts}
            loading={loading}
            className="min-h-[400px]"
            emptyStateMessage="No posts found"
          />
        </div>
      </FadeInContainer>

      {/* Pagination */}
      <FadeInContainer delay={600} duration={600}>
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPageAndFetch}
            />
          </div>
        )}
      </FadeInContainer>
    </div>
  );
};

export default PostsListView; 