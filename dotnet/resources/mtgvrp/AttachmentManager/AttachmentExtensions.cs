using System;
using System.Collections.Generic;
using GTANetworkAPI;
using Newtonsoft.Json;

namespace Server.Extensions
{
    /// <summary>
    /// Thanks to DasNiels for providing Efficient Attachment Sync C#
    /// </summary>
    public static class AttachmentExtensions
    {
        /// <summary>
        /// Adds/Removes an attachment for an entity
        /// </summary>
        /// <param name="entity">The entity to attach the object to</param>
        /// <param name="attachment">The attachment, should be in string or long type</param>
        /// <param name="remove">Pass true to remove the specified attachment, false otherwise.</param>
        public static void ToggleAttachment( this Entity entity, dynamic attachment, bool remove )
        {
            if( !entity.HasData( "Attachments" ) )
                entity.SetData( "Attachments", new List<uint>( ) );

            List<uint> currentAttachments = entity.GetData<List<uint>>( "Attachments" );

            var attachmentHash = attachment is string ? (uint) NAPI.Util.GetHashKey( attachment ) : (uint) Convert.ToUInt32( attachment );

            if( attachmentHash == 0 )
            {
                Console.WriteLine( $"Attachment hash couldn't be found for { attachment }" );
                return;
            }

            if( currentAttachments.IndexOf( attachmentHash ) == -1 ) // if current attachment hasn't already been added
            {
                if( !remove ) // if it needs to be added
                {
                    currentAttachments.Add( attachmentHash );
                }
            }
            else if( remove ) // if it was found and needs to be removed
            {
                currentAttachments.Remove( attachmentHash );
            }

            // send updated data to clientside
            entity.SetSharedData( "attachmentsData", JsonConvert.SerializeObject(currentAttachments)); 
        }

        /// <summary>
        /// Returns true if an entity has a certain attachment
        /// </summary>
        /// <param name="entity">The entity to check</param>
        /// <param name="attachment">The attachment to look for</param>
        /// <returns>True if attachment was found, false otherwise</returns>
        public static bool HasAttachment( this Entity entity, dynamic attachment )
        {
            if( !entity.HasData( "Attachments" ) )
                return false;

            List<uint> currentAttachments = entity.GetData<List<uint>>( "Attachments" );

            var attachmentHash = attachment is string ? (uint) NAPI.Util.GetHashKey( attachment ) : (uint) Convert.ToUInt32( attachment );

            if( attachmentHash == 0 )
            {
                Console.WriteLine( $"Attachment hash couldn't be found for { attachment }" );
                return false;
            }
        
            return currentAttachments.IndexOf( attachmentHash ) != -1;
        }
    
        /// <summary>
        /// Clears the entity's current attachments
        /// </summary>
        /// <param name="entity">The entity to clear the attachments of</param>
        public static void ClearAttachments( this Entity entity )
        {
            if( !entity.HasData( "Attachments" ) )
                return;

            List<uint> currentAttachments = entity.GetData<List<uint>>( "Attachments" );

            if( currentAttachments.Count > 0 )
            {
                for( int i = currentAttachments.Count - 1; i >= 0; i-- )
                {
                    entity.ToggleAttachment( currentAttachments[ i ], true );
                }
            }

            entity.ResetSharedData( "attachmentsData" );
            entity.SetData( "Attachments", new List<uint>( ) );
        }
    }
}
